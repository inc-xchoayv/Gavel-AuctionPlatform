# Gavel — React-ի Ուղեցույց և Նախագծի Ճարտարապետություն (Հայերեն)

Այս ֆայլը ստեղծված է հատուկ քո կուրսային աշխատանքի պաշտպանության և React-ը խորությամբ հասկանալու համար։  
**Կանոն.** ամեն անգամ, երբ նախագծում ավելացնենք նոր ֆունկցիոնալ կամ օգտագործենք React-ի նոր գործիք, այս ֆայլը կթարմացվի՝ պարզ բացատրությամբ և մեր կոդի օրինակով։

---

## 1. Ինչո՞ւ անցանք React-ի (և ինչպես պատասխանել պաշտպանության ժամանակ)

Սովորական HTML + JS-ում մենք ունեինք 15 առանձին `.html` ֆայլ։ Ամեն ֆայլում կրկնվում էին նույն `<header>`, `<footer>` և չաթի վիջեթը (~220 տող × 15 էջ = 3,300 տող կրկնվող կոդ)։ Իսկ աճուրդների կատալոգում 15 քարտերը պատճենված էին ձեռքով (~450 տող HTML)։  
React-ով մենք կայքը դարձրինք **SPA (Single Page Application — Մեկ էջանի հավելված)**.

1. **Մեկ HTML մուտքի կետ (`index.html`).** Բրաուզերը բեռնում է միայն մեկ `<div id="root"></div>`, իսկ React-ը դրա մեջ ակնթարթորեն փոխում է էջերը՝ առանց էջը վերաբեռնելու (reload):
2. **Բազմակի օգտագործվող կոմպոնենտներ (Reusable Components).** `Header`, `Footer`, `ChatWidget`, `CategoryGrid`, `<LotCard />` գրված են **մեկ անգամ** `src/components/` պանակում և օգտագործվում են տարբեր էջերում։
3. **Տվյալներից կախված ինտերֆեյս (Declarative UI).** Մենք այլևս ձեռքով չենք փնտրում DOM էլեմենտներ (`document.querySelectorAll`) տեքստ կամ դաս փոխելու համար։ Երբ փոխվում է վիճակը (`state` — օրինակ՝ լեզուն, լոտերի ֆիլտրը կամ նոր առաջարկվող գինը), React-ն ավտոմատ թարմացնում է էկրանը։

---

## 2. Նախագծի նոր կառուցվածքը (Vite + React)

```
Gavel_auction_course_work/
├── index.html                  ← Միակ HTML ֆայլը (<div id="root"></div>)
├── package.json                ← Գրադարանների ցանկ (react, react-dom, react-router-dom, vite)
├── vite.config.js              ← Vite հավաքիչի (bundler) կարգավորում
├── public/
│   ├── favicon.ico
│   └── images/                 ← Բոլոր նկարները (/images/...)
└── src/
    ├── main.jsx                ← React-ի մեկնարկի կետը (I18n, Auth, LotProvider + App)
    ├── App.jsx                 ← Բոլոր 15 էջերի երթուղիները (Routes)
    ├── styles/                 ← Մեր բոլոր CSS ֆայլերը (common.css + 15 էջերի CSS)
    ├── data/
    │   ├── lots.json           ← Բոլոր աճուրդների նախնական տվյալների բազան
    │   ├── categories.json     ← 18 կատեգորիաների տվյալները
    │   ├── users.json          ← Սկզբնական օգտատերերը և ադմինը
    │   └── lang/               ← hy.json, en.json, ru.json (495-ական բանալի)
    ├── context/
    │   └── LotContext.jsx      ← Լոտերի գլոբալ վիճակը, LocalStorage և սակարկության տրամաբանությունը
    ├── i18n/
    │   └── I18nContext.jsx     ← Բազմալեզվության համակարգը (Context + useI18n hook)
    ├── auth/
    │   ├── AuthContext.jsx     ← Մուտք, գրանցում, սեսիա, դերեր (guest / user / admin)
    │   └── RouteGuards.jsx     ← Էջերի պաշտպանություն (ProtectedRoute, GuestOnlyRoute)
    ├── hooks/
    │   └── usePageTitle.js     ← Էջի <title>-ը լեզվին համապատասխան թարմացնող hook
    ├── components/
    │   ├── Layout.jsx          ← Ընդհանուր կմախք (Header + <Outlet/> + Footer + ChatWidget)
    │   ├── Header.jsx          ← Դերային նավիգացիա և լեզվի ընտրիչ
    │   ├── Footer.jsx          ← Կայքի ստորին հատված
    │   ├── ChatWidget.jsx      ← Առցանց օգնական և վաճառողի չաթ
    │   ├── CategoryGrid.jsx    ← 4×4 կատեգորիաների ցանց՝ «Տեսնել ավելին» կոճակով
    │   └── LotCard.jsx         ← Լոտի ունիվերսալ քարտ (Ցանց / Ցուցակ, բեյջեր, հիշեցումներ)
    └── pages/                  ← Բոլոր 15 էջերը որպես React կոմպոնենտներ (.jsx)
```

---

## 3. React-ի հիմնական հասկացությունները՝ մեր նախագծի օրինակներով

### 3.1. JSX (JavaScript XML)
**Ի՞նչ է.** JSX-ը թույլ է տալիս JavaScript ֆունկցիայի մեջ գրել HTML-ի նման կոդ։  
**Տարբերությունները սովորական HTML-ից.**
- `class`-ի փոխարեն գրում ենք `className` (քանի որ `class`-ը JS-ում զբաղված բառ է):
- `for`-ի փոխարեն `<label>`-ում գրում ենք `htmlFor`:
- Բոլոր թեգերը պետք է փակվեն (օր.՝ `<img ... />`, `<input ... />`):
- `{ ... }` ձևավոր փակագծերի մեջ կարող ենք գրել ցանկացած JS արտահայտություն (օրինակ՝ `{t("nav_home")}` կամ `${lot.currentBid.toLocaleString()}`):

---

### 3.2. Կոմպոնենտ (Component) և Props (Հատկություններ)
**Ի՞նչ է.** Կոմպոնենտը սովորական JS ֆունկցիա է, որի անունը սկսվում է մեծատառով և որը վերադարձնում է JSX:  
**Ի՞նչ է `props`-ը.** Ծնող կոմպոնենտից զավակ կոմպոնենտին փոխանցվող տվյալներն են (արգումենտները)։  
*Օրինակ մեր նոր `<LotCard />` կոմպոնենտից (`src/components/LotCard.jsx`).*
```jsx
// Ծնող էջում (Auctions.jsx կամ Home.jsx) կանչում ենք այսպես՝
<LotCard lot={lot} viewMode="grid" />

// Իսկ հենց LotCard ֆունկցիայում ընդունում ենք props-երը՝
export default function LotCard({ lot, viewMode = "grid" }) {
  return (
    <article className={`card lot ${viewMode === "list" ? "lot-card-list" : ""}`}>
      <img src={lot.image} alt={lot.title} />
      <h3>{lot.title}</h3>
      <span className="price">${lot.currentBid.toLocaleString()}</span>
    </article>
  );
}
```

---

### 3.3. Զանգվածների մշակումը JSX-ում (`.map()`, `.filter()`, `.sort()` և `key={...}`)
Սովորական HTML-ում 15 քարտ ցուցադրելու համար պետք էր 15 անգամ ձեռքով պատճենել `<article className="card lot">...</article>` բլոկը։  
React-ում մենք պահում ենք լոտերի զանգվածը (`lots = [...]`), և `.map()` մեթոդով այն վերածում ենք քարտերի.
```jsx
{filteredLots.map((lot) => (
  <LotCard key={lot.id} lot={lot} viewMode={viewMode} />
))}
```
> **Ինչո՞ւ է պարտադիր `key={lot.id}`-ն.**  
> React-ի Virtual DOM-ը օգտագործում է `key`-ը, որպեսզի իմանա, թե հենց որ քարտն է ավելացել, ջնջվել կամ փոխվել։ Առանց `key`-ի React-ը ստիպված կլիներ ամեն անգամ զրոյից վերանկարել ամբողջ ցուցակը։

---

### 3.4. `useState` — Կոմպոնենտի ներքին հիշողություն (State)
**Ի՞նչ է.** `useState`-ը ստեղծում է փոփոխական և այն թարմացնող ֆունկցիա։ Երբ կանչում ենք `set...()`, React-ը ավտոմատ վերանկարում է կոմպոնենտի այն մասը, որտեղ այդ տվյալն օգտագործվում է։  

*Օրինակ մեր Կատալոգի ֆիլտրերից (`src/pages/Auctions.jsx`).*
```jsx
const [searchTerm, setSearchTerm] = useState("");
const [statusFilter, setStatusFilter] = useState("all");
const [selectedCategories, setSelectedCategories] = useState([]);
const [viewMode, setViewMode] = useState("grid"); // "grid" կամ "list"
```
Երբ օգտատերը սեղմում է `⊞` կամ `☰` կոճակներին, աշխատում է `setViewMode("list")`, և կատալոգը առանց էջը վերաբեռնելու վայրկյանական դառնում է ցուցակ։

---

### 3.5. `useMemo` — Ծանր հաշվարկների օպտիմալացում (Performance)
Երբ ունենք հարյուրավոր լոտեր, չենք ցանկանում ամեն կոճակ սեղմելիս նորից ֆիլտրել ու սորտավորել ամբողջ ցուցակը։ `useMemo`-ն հիշում է ֆիլտրման արդյունքը և վերահաշվարկում է **միայն այն ժամանակ**, երբ փոխվում է ֆիլտրերից որևէ մեկը.
```jsx
const filteredLots = useMemo(() => {
  return lots
    .filter(lot => matchCategory && matchSearch && matchPrice)
    .sort((a, b) => sortByPriceOrBids);
}, [lots, statusFilter, selectedCategories, activeSearch, appliedMinPrice, appliedMaxPrice, sortBy]);
```

---

### 3.6. `createContext` և `useContext` — Գլոբալ վիճակ (Global State)
Մեր նախագծում կա 3 հզոր Context.
1. **`I18nContext` (`src/i18n/I18nContext.jsx`)** — Պատասխանատու է 3 լեզուների (HY/EN/RU) և `{t("key")}` թարգմանությունների համար։
2. **`AuthContext` (`src/auth/AuthContext.jsx`)** — Պատասխանատու է օգտատիրոջ մուտքի, գրանցման, դերերի (`guest`, `user`, `admin`) և ծանուցումների (`flash toast`) համար։
3. **`LotContext` (`src/context/LotContext.jsx`)** — Պատասխանատու է ամբողջ կայքի լոտերի, նոր լոտ ավելացնելու, խաղադրույք կատարելու (`placeBid`) և հիշեցումների (`remindedLots`) համար։

---

### 3.7. Ինչպե՞ս է աշխատում «Օգտատերը նոր լոտ/քարտ է ավելացնում» սցենարը (Շատ կարևոր պաշտպանության համար)
Սա այն հարցն է, որը տվել էիր սկզբում՝ *«հետո օգտատերերը քարտեր են ավելացնելու, ո՞նց է դա աշխատելու»*։

Մեր նոր React ճարտարապետությունում դա աշխատում է հետևյալ կերպ.
1. **Քայլ 1 (Ֆորմայի լրացում).** Օգտատերը բացում է `/add-lot` էջը և լրացնում է վերնագիրը, կատեգորիան, մեկնարկային գինը և նկարագրությունը (`src/pages/AddLot.jsx`):
2. **Քայլ 2 (Կանչվում է `addLot()` ֆունկցիան).** `AddLot.jsx`-ը կանչում է `LotContext`-ի `addLot(newLotData)` մեթոդը:
3. **Քայլ 3 (Ավելացում և Պահպանում LocalStorage-ում).** `LotContext`-ը նոր լոտին տալիս է յուրահատուկ ID (օրինակ՝ #1053) և այն ավելացնում է `lots` զանգվածի սկզբում՝ ավտոմատ պահելով բրաուզերի `localStorage`-ում (`gavel_lots` բանալիով):
4. **Քայլ 4 (Ակնթարթային արտացոլում).** Օգտատերը վերահասցեավորվում է `/auctions` կամ `/my-lots`, և նոր քարտն **անմիջապես հայտնվում է կատալոգում և գլխավոր էջում**՝ առանց որևէ ֆայլ ձեռքով խմբագրելու:
5. **Հետագայում Python Backend-ի միացում.** Երբ դեկտեմբերին գրենք Python (FastAPI/Django) բեքենդը, `localStorage.setItem`-ի փոխարեն կգրենք ընդամենը մեկ տող՝ `await fetch("/api/lots", { method: "POST", body: JSON.stringify(newLot) })`, իսկ ամբողջ React կոդը կմնա նույնությամբ:

---

### 3.8. `useSearchParams` — URL-ից պարամետրեր կարդալը
Երբ օգտատերը գլխավոր էջում սեղմում է «Ավտոմեքենաներ» կատեգորիայի վրա, բրաուզերը բացում է `/auctions?category=cars` կամ `/auction-detail?id=405`։  
React-ում դրանք կարդում ենք `useSearchParams()` hook-ով.
```jsx
const [searchParams] = useSearchParams();
const category = searchParams.get("category"); // "cars"
const lotId = searchParams.get("id"); // "405"
const lot = getLotById(lotId); // գտնում է Porsche-ի տվյալները
```

---

## 4. Ինչպե՞ս գործարկել նախագիծը

Տերմինալում (նախագծի արմատային պանակում)՝
```bash
npm install      # Միայն առաջին անգամ՝ գրադարանները տեղադրելու համար
npm run dev      # Գործարկում է տեղային սերվերը (http://localhost:5173)
npm run build    # Ստուգում է կոմպիլյացիան և հավաքում է պատրաստի կայքը dist/ պանակում
```

---

## 5. Փոփոխությունների մատյան (Changelog)

- **Փուլ 1 — React + Vite միգրացիա (Նոյեմբեր 2026).**
  - Ամբողջ նախագիծը տեղափոխվեց Vite + React 18 + React Router v6 հարթակ։
  - Ստեղծվեցին `I18nContext` (3 լեզու՝ HY/EN/RU), `AuthContext` (սեսիա, մուտք, գրանցում, դերեր, flash toast), `ProtectedRoute` և `GuestOnlyRoute` պաշտպանիչ կոմպոնենտներ։
  - Բոլոր 15 էջերը վերածվեցին React կոմպոնենտների (`src/pages/*.jsx`)՝ պահպանելով բոլոր CSS դասերը և 0 inline style կանոնը։
- **Փուլ 2 — Լոտերի Դինամիկ Համակարգ և Քարտեր (Նոյեմբեր 2026).**
  - Ստեղծվեց `src/data/lots.json` ռեալիստական 12 լոտերով (ավտոմեքենաներ, դասական մեքենաներ, արվեստ, շվեյցարական ժամացույցներ, գորգեր, հնաոճ իրեր)։
  - Ստեղծվեց `LotContext.jsx`՝ գլոբալ state, LocalStorage sync, նոր լոտ ավելացնելու (`addLot`), սակարկության (`placeBid`) և հիշեցումների (`toggleRemind`) ֆունկցիաներով։
  - Ստեղծվեց ունիվերսալ `<LotCard />` կոմպոնենտը (Grid/List տեսքեր, Copart Live և Rare բեյջեր, SVG հիշեցման կոճակ)։
  - `Auctions.jsx` կատալոգը ամբողջությամբ կապվեց իրական state-ին՝ ըստ անվան և նկարագրության որոնում, կատեգորիաների բազմակի ֆիլտր, գնային միջակայք, սորտավորում (ամենաթեժերը, գինը աճման/նվազման, առաջարկների քանակ) և Grid/List փոխարկիչ։
  - `AddLot.jsx` էջում 4-քայլանի wizard-ը դարձավ լիարժեք աշխատող. նոր ավելացված լոտն անմիջապես պահպանվում է և հայտնվում կայքի կատալոգում։
  - `AuctionDetail.jsx` և `PlaceBid.jsx` էջերը կապվեցին URL-ի `?id=` պարամետրին և թույլ են տալիս իրական ժամանակում բարձրացնել գինը (կենդանի սակարկություն)։

- **Փուլ 3 — Քարտերի 4 Ռեժիմների (Auction Modes) և UI-ի Կատարելագործում (Նոյեմբեր 2026).**
  - **4 Հստակ Աճուրդային Ռեժիմներ (`LotCard.jsx` & `common.css`):**
    1. **Ուղիղ (Live):** Ակտիվ լոտեր, որոնք դեռ չեն ավարտվում (`.chip.chip-live`, բաց կանաչ ֆոն, կանաչ բաբախող կետ)։
    2. **Մնաց XX:XX (< 15 րոպե):** Ավարտին մոտեցող լոտեր (`.chip.chip-ending`, վառ կարմիր առկայծող ֆոն `@keyframes chipPulsingGlow` անիմացիայով, սպիտակ կետ)։
    3. **Շուտով (Upcoming):** Դեռ չմեկնարկած աճուրդներ (`.chip.chip-upcoming`, փափուկ կապույտ ֆոն, կապույտ կետ)։
    4. **Ավարտված / Վաճառված (Ended / Sold):** Ավարտված լոտեր (`.chip.chip-ended`, չեզոք մոխրագույն ֆոն, մոխրագույն կետ)։
  - **Լեզվական ճշգրտումներ:** `hy.json`, `en.json`, `ru.json` ֆայլերում ավելացվեցին `mode_live`, `mode_ending_prefix`, `mode_upcoming`, `mode_ended`, և `hist_ended` բանալիները։
  - **UI Շտկումներ:** Կատալոգի որոնման դաշտում պատկերակի համընկնումը վերացվեց, ցուցադրման ռեժիմի կոճակները կողք-կողքի հարթեցվեցին, հիշեցման կոճակը դարձավ կլոր (32×32px), իսկ կատեգորիաների կոճակից հեռացվեց ավելորդ ենթատեքստը։
