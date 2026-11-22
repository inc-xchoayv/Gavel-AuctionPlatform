import asyncio
import json
import time
from datetime import datetime, timedelta, timezone
from typing import Any

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from db import (
    UPLOADS_DIR,
    get_conn,
    init_db,
    row_to_lot,
    row_to_user,
    save_data_url_if_needed,
)

init_db()

app = FastAPI(title="Gavel Auction Platform API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")

bid_lock = asyncio.Lock()


class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        await self.broadcast({"type": "online_count", "count": len(self.active_connections)})

    async def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        await self.broadcast({"type": "online_count", "count": len(self.active_connections)})

    async def broadcast(self, message: dict):
        payload = json.dumps(message, ensure_ascii=False)
        stale: list[WebSocket] = []
        for ws in list(self.active_connections):
            try:
                await ws.send_text(payload)
            except Exception:
                stale.append(ws)
        for ws in stale:
            if ws in self.active_connections:
                self.active_connections.remove(ws)


manager = ConnectionManager()


class LoginRequest(BaseModel):
    email: str
    password: str


class RegisterRequest(BaseModel):
    firstName: str
    lastName: str
    email: str
    password: str
    phone: str | None = ""


class PlaceBidRequest(BaseModel):
    amount: float
    bidderId: Any = "guest"
    bidderName: str = "Անանուն մասնակից"
    bidderAvatar: str | None = None


def format_duration_left(seconds: float) -> str:
    if seconds <= 0:
        return "00:00"
    total = int(seconds)
    days = total // 86400
    hours = (total % 86400) // 3600
    mins = (total % 3600) // 60
    secs = total % 60
    if days >= 1:
        return f"{days}d {hours:02d}h"
    return f"{hours:02d}:{mins:02d}:{secs:02d}"


@app.get("/api/health")
def health():
    return {"ok": True, "online": len(manager.active_connections)}


# ==============================================================================
# AUTH & USERS
# ==============================================================================
@app.post("/api/auth/login")
def login(body: LoginRequest):
    conn = get_conn()
    row = conn.execute(
        "SELECT * FROM users WHERE lower(email) = lower(?)", (body.email.strip(),)
    ).fetchone()
    conn.close()
    if not row or row["password"] != body.password:
        return {"ok": False, "error": "err_wrong_credentials"}
    if row["status"] == "blocked":
        return {"ok": False, "error": "err_account_blocked"}
    return {"ok": True, "user": row_to_user(row, include_private=True)}


@app.post("/api/auth/register")
def register(body: RegisterRequest):
    conn = get_conn()
    existing = conn.execute(
        "SELECT id FROM users WHERE lower(email) = lower(?)", (body.email.strip(),)
    ).fetchone()
    if existing:
        conn.close()
        return {"ok": False, "error": "err_email_exists"}

    user_id = str(int(time.time() * 1000))
    phone = body.phone or "+374 94 552234"
    registered_at = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    verif = {
        "status": "unverified",
        "idNumber": "",
        "citizenship": "am",
        "firstName": "",
        "lastName": "",
        "dob": "",
        "phone": phone,
        "files": [],
    }
    conn.execute(
        """
        INSERT INTO users (
            id, first_name, last_name, email, password, phone, role, status,
            avatar, registered_at, address, city, zip, bio,
            balance, free_balance, locked_balance,
            cards_json, verification_json, notifications_json
        ) VALUES (?, ?, ?, ?, ?, ?, 'user', 'active', '/images/avatar-winner.svg', ?, '', '', '', '', 0, 0, 0, '[]', ?, '{}')
        """,
        (
            user_id,
            body.firstName.strip(),
            body.lastName.strip(),
            body.email.strip().lower(),
            body.password,
            phone,
            registered_at,
            json.dumps(verif, ensure_ascii=False),
        ),
    )
    conn.commit()
    row = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    conn.close()
    return {"ok": True, "user": row_to_user(row, include_private=True)}


@app.get("/api/users")
def list_users():
    conn = get_conn()
    rows = conn.execute("SELECT * FROM users ORDER BY registered_at DESC").fetchall()
    conn.close()
    return [row_to_user(r, include_private=False) for r in rows]


@app.get("/api/users/{user_id}")
def get_user(user_id: str):
    conn = get_conn()
    row = conn.execute("SELECT * FROM users WHERE id = ?", (str(user_id),)).fetchone()
    if not row:
        all_rows = conn.execute("SELECT * FROM users").fetchall()
        for r in all_rows:
            full = f"{r['first_name']} {r['last_name']}".strip().lower()
            if full == user_id.strip().lower():
                row = r
                break
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="User not found")
    return row_to_user(row, include_private=False)


@app.patch("/api/users/{user_id}")
def update_user(user_id: str, payload: dict[str, Any]):
    conn = get_conn()
    row = conn.execute("SELECT * FROM users WHERE id = ?", (str(user_id),)).fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="User not found")

    field_map = {
        "firstName": "first_name",
        "lastName": "last_name",
        "email": "email",
        "phone": "phone",
        "address": "address",
        "city": "city",
        "zip": "zip",
        "bio": "bio",
        "balance": "balance",
        "freeBalance": "free_balance",
        "lockedBalance": "locked_balance",
        "status": "status",
    }

    updates: list[str] = []
    values: list[Any] = []

    for js_key, db_col in field_map.items():
        if js_key in payload:
            updates.append(f"{db_col} = ?")
            values.append(payload[js_key])

    if "avatar" in payload and payload["avatar"]:
        saved_avatar = save_data_url_if_needed(payload["avatar"])
        updates.append("avatar = ?")
        values.append(saved_avatar)

    if "cards" in payload:
        updates.append("cards_json = ?")
        values.append(json.dumps(payload["cards"], ensure_ascii=False))

    if "verification" in payload:
        updates.append("verification_json = ?")
        values.append(json.dumps(payload["verification"], ensure_ascii=False))

    if "notifications" in payload:
        updates.append("notifications_json = ?")
        values.append(json.dumps(payload["notifications"], ensure_ascii=False))

    if updates:
        values.append(str(user_id))
        conn.execute(f"UPDATE users SET {', '.join(updates)} WHERE id = ?", values)
        conn.commit()

    updated_row = conn.execute("SELECT * FROM users WHERE id = ?", (str(user_id),)).fetchone()
    conn.close()
    return {"ok": True, "user": row_to_user(updated_row, include_private=True)}


# ==============================================================================
# LOTS & LIVE BIDDING
# ==============================================================================
@app.get("/api/lots")
def list_lots():
    conn = get_conn()
    rows = conn.execute("SELECT * FROM lots ORDER BY id DESC").fetchall()
    result = [row_to_lot(r, conn) for r in rows]
    conn.close()
    return result


@app.get("/api/lots/{lot_id}")
def get_lot(lot_id: int):
    conn = get_conn()
    row = conn.execute("SELECT * FROM lots WHERE id = ?", (lot_id,)).fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Lot not found")
    data = row_to_lot(row, conn)
    conn.close()
    return data


@app.post("/api/lots")
async def create_lot(payload: dict[str, Any]):
    category_id = "cars" if payload.get("categoryId") == "classic-cars" else payload.get("categoryId", "art")
    is_car = category_id == "cars"
    duration_type = payload.get("durationType", "7d")
    is_live = duration_type == "live" or payload.get("auctionFormat") == "live" or is_car

    now = datetime.now(timezone.utc)
    if duration_type == "24h":
        ends_at_dt = now + timedelta(hours=24)
        ends_in = "24:00:00"
    elif duration_type == "3d":
        ends_at_dt = now + timedelta(days=3)
        ends_in = "3d 00h"
    elif duration_type == "14d":
        ends_at_dt = now + timedelta(days=14)
        ends_in = "14d 00h"
    elif duration_type == "custom" and payload.get("customEndsAt"):
        ends_at_dt = datetime.fromisoformat(payload["customEndsAt"].replace("Z", "+00:00"))
        ends_in = format_duration_left((ends_at_dt - now).total_seconds())
    elif duration_type == "live" and payload.get("liveStartAt"):
        ends_at_dt = datetime.fromisoformat(payload["liveStartAt"].replace("Z", "+00:00"))
        ends_in = format_duration_left((ends_at_dt - now).total_seconds())
    else:
        ends_at_dt = now + timedelta(days=7)
        ends_in = "7d 00h"

    raw_gallery = payload.get("gallery") or []
    saved_gallery = [save_data_url_if_needed(img) for img in raw_gallery if img]
    raw_cover = payload.get("image") or (saved_gallery[0] if saved_gallery else None)
    cover_image = save_data_url_if_needed(raw_cover) if raw_cover else (
        "/images/car-front.jpg" if is_car else "/images/lot-painting.jpg"
    )
    if not saved_gallery:
        saved_gallery = [cover_image]

    starting_price = float(payload.get("startingPrice") or 100)
    min_increment = float(payload.get("minIncrement") or 20)
    seller = payload.get("seller") or {"id": "me", "name": "Current User", "verified": False, "rating": 5.0}
    if seller.get("avatar"):
        seller["avatar"] = save_data_url_if_needed(seller["avatar"])

    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        """
        INSERT INTO lots (
            title, category_id, image, gallery_json, current_bid, starting_price,
            min_increment, currency, bids_count, status, badge, auction_format,
            duration_type, live_start_at, is_hot, featured, ends_in, ends_at,
            seller_json, specs_json, description, contact_phone, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, '$', 0, 'active', ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            str(payload.get("title") or "Untitled Lot").strip(),
            category_id,
            cover_image,
            json.dumps(saved_gallery, ensure_ascii=False),
            starting_price,
            starting_price,
            min_increment,
            "copart-live" if is_live else "live",
            "live" if is_live else "timed",
            duration_type,
            payload.get("liveStartAt"),
            1 if (duration_type == "24h" or is_live) else 0,
            ends_in,
            ends_at_dt.isoformat(),
            json.dumps(seller, ensure_ascii=False),
            json.dumps(payload.get("specs") or {}, ensure_ascii=False),
            str(payload.get("description") or "").strip(),
            str(payload.get("contactPhone") or "").strip(),
            now.isoformat(),
        ),
    )
    new_id = cur.lastrowid
    conn.commit()
    row = conn.execute("SELECT * FROM lots WHERE id = ?", (new_id,)).fetchone()
    created_lot = row_to_lot(row, conn)
    conn.close()

    await manager.broadcast({"type": "lot_created", "lot": created_lot})
    return created_lot


@app.post("/api/lots/{lot_id}/bids")
async def place_bid(lot_id: int, body: PlaceBidRequest):
    async with bid_lock:
        conn = get_conn()
        row = conn.execute("SELECT * FROM lots WHERE id = ?", (lot_id,)).fetchone()
        if not row:
            conn.close()
            raise HTTPException(status_code=404, detail="Լոտը չի գտնվել:")

        cur_price = float(row["current_bid"] or row["starting_price"] or 0)
        if body.amount <= cur_price:
            conn.close()
            raise HTTPException(
                status_code=400,
                detail=f"Առաջարկը պետք է գերազանցի ընթացիկ գինը (${cur_price:,.0f})",
            )

        now_iso = datetime.now(timezone.utc).isoformat()
        conn.execute(
            """
            INSERT INTO bids (lot_id, bidder_id, bidder_name, bidder_avatar, amount, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                lot_id,
                str(body.bidderId),
                body.bidderName,
                body.bidderAvatar,
                float(body.amount),
                now_iso,
            ),
        )
        conn.execute(
            """
            UPDATE lots
            SET current_bid = ?,
                bids_count = bids_count + 1,
                last_bidder = ?,
                last_bidder_id = ?,
                last_bid_time = ?
            WHERE id = ?
            """,
            (
                float(body.amount),
                body.bidderName,
                str(body.bidderId),
                now_iso,
                lot_id,
            ),
        )
        conn.commit()
        updated_row = conn.execute("SELECT * FROM lots WHERE id = ?", (lot_id,)).fetchone()
        updated_lot = row_to_lot(updated_row, conn)
        conn.close()

    await manager.broadcast(
        {
            "type": "bid_placed",
            "lotId": lot_id,
            "lot": updated_lot,
            "resetStepSeconds": 15,
        }
    )
    return updated_lot


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive; accept optional ping/pong from client
            msg = await websocket.receive_text()
            if msg == "ping":
                await websocket.send_text(json.dumps({"type": "pong"}))
    except WebSocketDisconnect:
        await manager.disconnect(websocket)
    except Exception:
        await manager.disconnect(websocket)
