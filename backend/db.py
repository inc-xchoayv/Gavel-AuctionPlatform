import base64
import json
import os
import sqlite3
import time
import uuid
from datetime import datetime, timezone
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent
DB_PATH = BASE_DIR / "gavel.db"
UPLOADS_DIR = BASE_DIR / "uploads"
SEED_USERS_PATH = PROJECT_ROOT / "src" / "data" / "users.json"
SEED_LOTS_PATH = PROJECT_ROOT / "src" / "data" / "lots.json"

UPLOADS_DIR.mkdir(parents=True, exist_ok=True)


def get_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(str(DB_PATH), check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute("PRAGMA foreign_keys=ON;")
    return conn


def save_data_url_if_needed(src: str | None) -> str:
    """If src is a base64 data:image/... URL, save it to backend/uploads/ and return /uploads/<name>."""
    if not src or not isinstance(src, str):
        return ""
    if not src.startswith("data:image/"):
        return src
    try:
        header, b64data = src.split(",", 1)
        ext = "jpg"
        if "image/png" in header:
            ext = "png"
        elif "image/webp" in header:
            ext = "webp"
        elif "image/svg+xml" in header:
            ext = "svg"
        elif "image/gif" in header:
            ext = "gif"
        filename = f"{int(time.time() * 1000)}_{uuid.uuid4().hex[:8]}.{ext}"
        file_path = UPLOADS_DIR / filename
        file_path.write_bytes(base64.b64decode(b64data))
        return f"/uploads/{filename}"
    except Exception:
        return src


def init_db():
    conn = get_conn()
    cur = conn.cursor()

    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            phone TEXT DEFAULT '',
            role TEXT DEFAULT 'user',
            status TEXT DEFAULT 'active',
            avatar TEXT DEFAULT '/images/avatar-winner.svg',
            registered_at TEXT DEFAULT '',
            address TEXT DEFAULT '',
            city TEXT DEFAULT '',
            zip TEXT DEFAULT '',
            bio TEXT DEFAULT '',
            balance REAL DEFAULT 0,
            free_balance REAL DEFAULT 0,
            locked_balance REAL DEFAULT 0,
            cards_json TEXT DEFAULT '[]',
            verification_json TEXT DEFAULT '{}',
            notifications_json TEXT DEFAULT '{}'
        )
        """
    )

    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS lots (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            category_id TEXT NOT NULL,
            image TEXT NOT NULL,
            gallery_json TEXT DEFAULT '[]',
            current_bid REAL NOT NULL,
            starting_price REAL NOT NULL,
            min_increment REAL DEFAULT 50,
            currency TEXT DEFAULT '$',
            bids_count INTEGER DEFAULT 0,
            status TEXT DEFAULT 'active',
            badge TEXT DEFAULT 'live',
            auction_format TEXT DEFAULT 'timed',
            duration_type TEXT DEFAULT '7d',
            live_start_at TEXT,
            is_hot INTEGER DEFAULT 0,
            featured INTEGER DEFAULT 0,
            ends_in TEXT DEFAULT '7d 00h',
            ends_at TEXT DEFAULT '',
            seller_json TEXT DEFAULT '{}',
            specs_json TEXT DEFAULT '{}',
            description TEXT DEFAULT '',
            contact_phone TEXT DEFAULT '',
            last_bidder TEXT,
            last_bidder_id TEXT,
            last_bid_time TEXT,
            created_at TEXT DEFAULT ''
        )
        """
    )

    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS bids (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lot_id INTEGER NOT NULL,
            bidder_id TEXT NOT NULL,
            bidder_name TEXT NOT NULL,
            bidder_avatar TEXT,
            amount REAL NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY (lot_id) REFERENCES lots(id) ON DELETE CASCADE
        )
        """
    )

    conn.commit()

    # Seed users if empty
    user_count = cur.execute("SELECT COUNT(*) FROM users").fetchone()[0]
    if user_count == 0 and SEED_USERS_PATH.exists():
        seed_users = json.loads(SEED_USERS_PATH.read_text(encoding="utf-8"))
        for u in seed_users:
            avatar = u.get("avatar") or "/images/avatar-winner.svg"
            if avatar.startswith("images/"):
                avatar = "/" + avatar
            is_garik = str(u.get("id")) == "1"
            default_cards = (
                [
                    {
                        "id": "card_mc_4242",
                        "brand": "Mastercard",
                        "num": "•••• 4242",
                        "last4": "4242",
                        "exp": "12/28",
                        "holder": "GARIK HARUTYUNYAN",
                        "isPrimary": True,
                    },
                    {
                        "id": "card_visa_8819",
                        "brand": "Visa Gold",
                        "num": "•••• 8819",
                        "last4": "8819",
                        "exp": "09/27",
                        "holder": "GARIK HARUTYUNYAN",
                        "isPrimary": False,
                    },
                ]
                if is_garik
                else []
            )
            verif = {
                "status": "verified" if is_garik else "unverified",
                "idNumber": "",
                "citizenship": "am",
                "firstName": "",
                "lastName": "",
                "dob": "",
                "phone": u.get("phone") or "+374 94 552234",
                "files": [],
            }
            cur.execute(
                """
                INSERT OR IGNORE INTO users (
                    id, first_name, last_name, email, password, phone, role, status,
                    avatar, registered_at, address, city, zip, bio,
                    balance, free_balance, locked_balance,
                    cards_json, verification_json, notifications_json
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    str(u.get("id")),
                    u.get("firstName", ""),
                    u.get("lastName", ""),
                    u.get("email", "").lower(),
                    u.get("password", ""),
                    u.get("phone", ""),
                    u.get("role", "user"),
                    u.get("status", "active"),
                    avatar,
                    u.get("registeredAt", "2026-01-14"),
                    "",
                    "",
                    "",
                    "",
                    4200 if is_garik else 0,
                    2950 if is_garik else 0,
                    1250 if is_garik else 0,
                    json.dumps(default_cards, ensure_ascii=False),
                    json.dumps(verif, ensure_ascii=False),
                    json.dumps({}, ensure_ascii=False),
                ),
            )
        conn.commit()

    # Seed lots if empty
    lot_count = cur.execute("SELECT COUNT(*) FROM lots").fetchone()[0]
    if lot_count == 0 and SEED_LOTS_PATH.exists():
        seed_lots = json.loads(SEED_LOTS_PATH.read_text(encoding="utf-8"))
        for lot in seed_lots:
            cat_id = "cars" if lot.get("categoryId") == "classic-cars" else lot.get("categoryId", "art")
            is_car = cat_id == "cars"
            auction_fmt = "live" if (is_car or lot.get("badge") == "copart-live") else "timed"
            cur.execute(
                """
                INSERT OR IGNORE INTO lots (
                    id, title, category_id, image, gallery_json, current_bid, starting_price,
                    min_increment, currency, bids_count, status, badge, auction_format,
                    duration_type, live_start_at, is_hot, featured, ends_in, ends_at,
                    seller_json, specs_json, description, contact_phone, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    int(lot["id"]),
                    lot.get("title", "Untitled"),
                    cat_id,
                    lot.get("image", "/images/lot-painting.jpg"),
                    json.dumps(lot.get("gallery") or [lot.get("image", "/images/lot-painting.jpg")], ensure_ascii=False),
                    float(lot.get("currentBid", lot.get("startingPrice", 100))),
                    float(lot.get("startingPrice", 100)),
                    float(lot.get("minIncrement", 50)),
                    lot.get("currency", "$"),
                    int(lot.get("bidsCount", 0)),
                    lot.get("status", "active"),
                    lot.get("badge", "live"),
                    auction_fmt,
                    "live" if auction_fmt == "live" else "7d",
                    None,
                    1 if lot.get("isHot") else 0,
                    1 if lot.get("featured") else 0,
                    lot.get("endsIn", "7d 00h"),
                    lot.get("endsAt", ""),
                    json.dumps(lot.get("seller") or {}, ensure_ascii=False),
                    json.dumps(lot.get("specs") or {}, ensure_ascii=False),
                    lot.get("description", ""),
                    "",
                    datetime.now(timezone.utc).isoformat(),
                ),
            )
        conn.commit()

    conn.close()


def row_to_user(row: sqlite3.Row, include_private: bool = True) -> dict:
    data = {
        "id": int(row["id"]) if str(row["id"]).isdigit() else row["id"],
        "firstName": row["first_name"],
        "lastName": row["last_name"],
        "name": f"{row['first_name']} {row['last_name']}".strip(),
        "email": row["email"],
        "phone": row["phone"],
        "role": row["role"],
        "status": row["status"],
        "avatar": row["avatar"],
        "registeredAt": row["registered_at"],
        "address": row["address"],
        "city": row["city"],
        "zip": row["zip"],
        "bio": row["bio"],
        "verification": json.loads(row["verification_json"] or "{}"),
    }
    if include_private:
        data["balance"] = row["balance"]
        data["freeBalance"] = row["free_balance"]
        data["lockedBalance"] = row["locked_balance"]
        data["cards"] = json.loads(row["cards_json"] or "[]")
        data["notifications"] = json.loads(row["notifications_json"] or "{}")
    return data


def row_to_lot(row: sqlite3.Row, conn: sqlite3.Connection) -> dict:
    bid_rows = conn.execute(
        "SELECT id, bidder_id, bidder_name, bidder_avatar, amount, created_at FROM bids WHERE lot_id = ? ORDER BY id DESC LIMIT 50",
        (row["id"],),
    ).fetchall()
    bid_history = [
        {
            "id": f"bid_{b['id']}",
            "bidderId": int(b["bidder_id"]) if str(b["bidder_id"]).isdigit() else b["bidder_id"],
            "bidderName": b["bidder_name"],
            "bidderAvatar": b["bidder_avatar"],
            "amount": b["amount"],
            "time": b["created_at"],
        }
        for b in bid_rows
    ]
    return {
        "id": row["id"],
        "title": row["title"],
        "categoryId": row["category_id"],
        "image": row["image"],
        "gallery": json.loads(row["gallery_json"] or "[]"),
        "currentBid": row["current_bid"],
        "startingPrice": row["starting_price"],
        "minIncrement": row["min_increment"],
        "currency": row["currency"],
        "bidsCount": row["bids_count"],
        "bidHistory": bid_history,
        "status": row["status"],
        "badge": row["badge"],
        "auctionFormat": row["auction_format"],
        "durationType": row["duration_type"],
        "liveStartAt": row["live_start_at"],
        "isHot": bool(row["is_hot"]),
        "featured": bool(row["featured"]),
        "endsIn": row["ends_in"],
        "endsAt": row["ends_at"],
        "seller": json.loads(row["seller_json"] or "{}"),
        "specs": json.loads(row["specs_json"] or "{}"),
        "description": row["description"],
        "contactPhone": row["contact_phone"],
        "lastBidder": row["last_bidder"],
        "lastBidderId": (
            int(row["last_bidder_id"])
            if row["last_bidder_id"] and str(row["last_bidder_id"]).isdigit()
            else row["last_bidder_id"]
        ),
        "lastBidTime": row["last_bid_time"],
        "createdAt": row["created_at"],
    }
