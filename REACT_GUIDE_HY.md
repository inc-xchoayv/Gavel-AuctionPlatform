# Gavel — React-ի Ուղեցույց և Նախագծի Ճարտարապետություն (Հայերեն)

Այս ֆայլը ստեղծված է հատուկ քո կուրսային աշխատանքի պաշտպանության և React-ը խորությամբ հասկանալու համար։  
**Կանոն.** ամեն անգամ, երբ նախագծում ավելացնենք նոր ֆუნկցիոնալ կամ օգտագործենք React-ի նոր գործիք, այս ֆայլը կթարմացվի՝ պարզ բացատրությամբ և մեր կոդի օրինակով։

---

## 1. Ինչո՞ւ անցանք React-ի (և ինչպես պատասխանել պաշտպանության ժամանակ)

Սովորական HTML + JS-ում մենք ունեինք 15 առանձին `.html` ֆայլ։ Ամեն ֆայլում կրկնվում էին նույն `<header>`, `<footer>` և չաթի վիջեթը (~220 տող × 15 էջ = 3,300 տող կրկնվող կոդ)։  
React-ով մենք կայքը դարձրինք **SPA (Single Page Application — Մեկ էջանի հավելված)**.

1. **Մեկ HTML մուտքի կետ (`index.html`).** Բրաուզերը բեռնում է միայն մեկ `<div id="root"></div>`, իսկ React-ը դրա մեջ ակնթարթորեն փոխում է էջերը՝ առանց էջը վերաբեռնելու (reload):
2. **Բազմակի օգտագործվող կոմպոնենտներ (Reusable Components).** `Header`, `Footer`, `ChatWidget`, `CategoryGrid` գրված են **մեկ անգամ** `src/components/` պանակում։
3. **Տվյալներից կախված ինտերֆեյս (Declarative UI).** Մենք այլևս ձեռքով չենք փնտրում DOM էլեմենտներ (`document.querySelectorAll`) տեքստ կամ դաս փոխելու համար։ Երբ փոխվում է վիճակը (`state` — օրինակ՝ լեզուն կամ օգտատիրոջ սեսիան), React-ն ավտոմատ թարմացնում է էկրանը։

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
    ├── main.jsx                ← React-ի մեկնարկի կետը (միացնում է App-ը #root-ին)
    ├── App.jsx                 ← Բոլոր 15 էջերի երթուղիները (Routes)
    ├── styles/                 ← Մեր բոլոր CSS ֆայլերը (common.css + 15 էջերի CSS)
    ├── data/
    │   ├── categories.json     ← 18 կատեգորիաների տվյալները
    │   ├── users.json          ← Սկզբնական օգտատերերը և ադմինը
    │   └── lang/               ← hy.json, en.json, ru.json (495-ական բանալի)
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
    │   └── CategoryGrid.jsx    ← 4×4 կատեգորիաների ցանց՝ «Տեսնել ավելին» կոճակով
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
- `{ ... }` ձևավոր փակագծերի մեջ կարող ենք գրել ցանկացած JS արտահայտություն (օրինակ՝ `{t("nav_home")}`):

### 3.2. Կոմպոնենտ (Component) և Props (Հատկություններ)
**Ի՞նչ է.** Կոմպոնենտը սովորական JS ֆունկցիա է, որի անունը սկսվում է մեծատառով և որը վերադարձնում է JSX:  
**Ի՞նչ է `props`-ը.** Ծնող կոմպոնենտից երեխա կոմպոնենտին փոխանցվող արգումենտներն են (ինչպես ֆունկցիայի պարամետրերը)։  
*Օրինակ մեր կոդից (`src/components/CategoryGrid.jsx`).*
```jsx
function CategoryCard({ cat, lang, t, reveal }) {
  const name = cat.name[lang] || cat.name.hy;
  return (
    <Link to={`/auctions?category=${cat.id}`} className="cat-card ...">
      <div className="cat-title">{name}</div>
    </Link>
  );
}
```

### 3.3. `useState` — Կոմպոնենտի ներքին հիշողություն (State)
**Ի՞նչ է.** Երբ սովորական փոփոխականը (`let x = 1`) փոխվում է, React-ը չգիտի, որ պետք է էկրանը թարմացնել։ `useState`-ը ստեղծում է հատուկ փոփոխական և այն փոխող ֆունկցիա. հենց կանչում ենք `set...()`, React-ը վերանկարում է կոմպոնենտը։  
*Օրինակ 1 (`src/components/CategoryGrid.jsx`).*
```jsx
const [expanded, setExpanded] = useState(false);
// Սեղմելիս false-ը դառնում է true, և React-ը ցուցադրում է բոլոր 18 կատեգորիաները.
onClick={() => setExpanded((prev) => !prev)}
```
*Օրինակ 2 (`src/pages/Login.jsx` և `Register.jsx` — Controlled Inputs / Կառավարվող ֆորմաներ).*
```jsx
const [form, setForm] = useState({ email: "", password: "" });
const [errors, setErrors] = useState({});
```
Ինփութի արժեքը կապված է `value={form.email}`-ին և ամեն տառ գրելիս թարմացվում է `onChange={handleChange}`-ով։

### 3.4. `useEffect` — Կողմնակի գործողություններ (Side Effects)
**Ի՞նչ է.** Կատարում է գործողություն այն պահին, երբ կոմպոնենտը հայտնվում է էկրանին կամ երբ նշված փոփոխականը փոխվում է։  
*Օրինակ մեր կոդից (`src/hooks/usePageTitle.js`).*
```jsx
export default function usePageTitle(key) {
  const { t } = useI18n();
  useEffect(() => {
    document.title = t(key); // Թարմացնում է բրաուզերի ներդիրի վերնագիրը ամեն անգամ լեզուն կամ էջը փոխելիս
  }, [key, t]);
}
```

### 3.5. `createContext` և `useContext` — Գլոբալ վիճակ (Առանց «prop drilling»-ի)
**Ինչո՞ւ է պետք.** Ընտրված լեզուն (`lang`, `t()`) և մուտք գործած օգտատիրոջ տվյալները (`session`, `login`, `logout`) պետք են կայքի բոլոր 15 էջերին և Header-ին։ Context-ը թույլ է տալիս դրանք պահել մեկ կենտրոնական տեղում (`Provider`) և վերցնել ցանկացած կոմպոնենտում մեկ տողով.
- `const { t, lang, setLang } = useI18n();` (`src/i18n/I18nContext.jsx`)
- `const { session, role, login, register, logout } = useAuth();` (`src/auth/AuthContext.jsx`)

### 3.6. React Router (`BrowserRouter`, `Routes`, `Route`, `Link`, `NavLink`, `Outlet`, `Navigate`)
**Ի՞նչ է.** React-ում էջերի միջև անցումները կատարում է `react-router-dom` գրադարանը.
- `<Link to="/auctions">` — փոխում է URL-ը առանց էջը վերաբեռնելու (սովորական `<a href="...">`-ի փոխարեն):
- `<NavLink to="/auctions">` — նույնն է, ինչ `Link`-ը, բայց ինքնաշխատ ավելացնում է `active` CSS դասը, երբ տվյալ էջի վրա ենք (`src/components/Header.jsx`):
- `<Layout />` և `<Outlet />` (`src/components/Layout.jsx`) — `Header`-ը, `Footer`-ը և `ChatWidget`-ը մնում են տեղում, իսկ `<Outlet />`-ի փոխարեն տեղադրվում է ընթացիկ էջը (`Home`, `Auctions`, `Profile` և այլն):
- `<ProtectedRoute role="user">` և `<ProtectedRoute role="admin">` (`src/auth/RouteGuards.jsx`) — եթե հյուրը փորձի բացել `/my-lots`, `<Navigate to="/login?next=/my-lots" replace />`-ը նրան անմիջապես ուղարկում է մուտքի էջ։

---

## 4. Ինչպե՞ս գործարկել նախագիծը

Տերմինալում (նախագծի արմատային պանակում)՝
```bash
npm install      # Միայն առաջին անգամ՝ գրադարանները տեղադրելու համար
npm run dev      # Գործարկում է տեղային սերվերը (http://localhost:5173)
npm run build    # Հավաքում է պատրաստի կայքը dist/ պանակում
```

> **Ինչպե՞ս վերադառնալ հին (մաքուր HTML/JS) տարբերակին, եթե երբևէ պետք լինի.**  
> Մինչև React-ի անցումը ստեղծվել է Git պիտակ (tag)՝ `v1-html-final` (և քո `v1.0.0`-ն)։ Կարող ես ցանկացած պահի արտահանել հին տարբերակը ZIP-ով՝ `git archive --format=zip -o ../gavel-html.zip v1-html-final`:

---

## 5. Փոփոխությունների մատյան (Changelog)

- **Փուլ 1 — React + Vite միգրացիա (Նոյեմբեր 2026).**
  - Ամբողջ նախագիծը տեղափոխվեց Vite + React 18 + React Router v6 հարթակ։
  - Ստեղծվեցին `I18nContext` (3 լեզու՝ HY/EN/RU), `AuthContext` (սեսիա, մուտք, գրանցում, դերեր, flash toast), `ProtectedRoute` և `GuestOnlyRoute` պաշտպանիչ կոմպոնենտներ։
  - Առանձնացվեցին `Layout`, `Header`, `Footer`, `ChatWidget`, `CategoryGrid` (4×4 ցանց + «Տեսնել ավելին») բազմակի օգտագործվող կոմպոնենտները։
  - Բոլոր 15 էջերը վերածվեցին React կոմպոնենտների (`src/pages/*.jsx`)՝ պահպանելով բոլոր CSS դասերը և 0 inline style կանոնը։
