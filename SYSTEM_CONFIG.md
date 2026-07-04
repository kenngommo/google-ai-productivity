# 🔒 SYSTEM CONFIGURATION — GeminiFlow Sales Landing Page
> **Đọc file này TRƯỚC khi sửa bất kỳ thứ gì.** Đây là nguồn thông tin cấu hình chính xác nhất.

---

## 📌 Stack & Tooling
| Item | Value |
|---|---|
| Framework | Vite + React 18 + TypeScript |
| Styling | Tailwind CSS v4 (class-based, no config overrides) |
| Routing | **Hash routing** (`#/laptop-us`, `#about`, etc.) — required for GitHub Pages static hosting |
| Dev server | `npm run dev` → `http://localhost:5173` |
| Deploy | `npm run build` → `dist/` |

---

## 🗺️ Routing Architecture

The app uses **client-side hash routing** in `src/App.tsx` via a `hashchange` event listener.

```
/              → Main homepage (Hero → About → Services → Offers → Resources → Contact)
#/laptop-us   → Dedicated Laptop US landing page (no contact form — only Zalo CTA)
#about        → Scrolls to <About /> section on homepage
#services     → Scrolls to <Services /> section on homepage
#offers       → Scrolls to <ProOffers /> section on homepage
#resources    → Scrolls to <Resources /> section on homepage
```

> ⚠️ **Do NOT switch to path-based routing** (`/laptop-us`). GitHub Pages has no server-side fallback, so direct URL access would 404.

---

## 🖼️ Page: Laptop US (`#/laptop-us`)

- **Has**: Navbar + `<LaptopSection>` + `<Footer>` + Back-to-top + Zalo button
- **Does NOT have**: `<Contact>` form — intentionally removed per user request
- **"Liên hệ mua ngay"** button → opens Zalo chat (`window.open(zaloHref, '_blank')`)
- Section top padding: `pt-6 pb-20` (close to navbar, avoids large empty space)

---

## 💬 Contact / Zalo Info

| Field | Value |
|---|---|
| Zalo number (VI) | `098 938 2090` |
| Zalo number (EN) | `+84 98 938 2090` |
| Email | `kenngo.mmo@gmail.com` |
| Zalo link format | `https://zalo.me/<number with no spaces/plus/dots>` |

---

## 🎯 Floating Banner (Home Page Only)

Location: `src/App.tsx` — rendered in the main homepage layout only (not on `#/laptop-us`).

| Setting | Value / Notes |
|---|---|
| Default `top` | `74px` — just below navbar, bottom clears sandbox widget |
| Min `top` (clamp) | `74px` — cannot be dragged above navbar |
| Max `top` (clamp) | `window.innerHeight - 132 - 140` — stays above Zalo + Back-to-top |
| Drag axis | Vertical only (right side, fixed `right: 4px`) |
| Width | `185px` / `195px` (sm) |
| Indicator dot | 🟢 **Green** (`bg-google-green`) — NOT red |
| Bottom CTA text | **None** — "ĐĂNG KÝ NGAY" was intentionally removed |
| Click action | Scrolls to Contact form with `intent='buy'`, `role='opt5'` |
| CSS cursor | `cursor-grab` / `cursor-grabbing` during drag |

---

## 🎨 Color Palette (Tailwind custom tokens)

Defined in `tailwind.config` / `index.css`:

| Token | Hex (approx) |
|---|---|
| `google-blue` | `#4285F4` |
| `google-red` | `#EA4335` |
| `google-green` | `#34A853` |
| `google-yellow` | `#FBBC04` |
| `google-indigo` | `#3949AB` — **dark, avoid as gradient end on dark bg** |

> ⚠️ `google-indigo` is dark and blends into `bg-slate-950`. Use `sky-300`/`blue-400` as gradient endpoints on dark backgrounds instead.

---

## 🏷️ Gradient Fix — Laptop Heading

`src/components/Laptop.tsx` line ~166:

```tsx
// ✅ CORRECT — "về" is visible on dark background
<span className="bg-gradient-to-r from-google-blue via-blue-400 to-sky-300 bg-clip-text text-transparent">
  Mỹ về
</span>

// ❌ WRONG — google-indigo is too dark, "về" disappears
<span className="bg-gradient-to-r from-google-blue to-google-indigo bg-clip-text text-transparent">
  Mỹ về
</span>
```

---

## 🌐 Bilingual Support

The site is fully bilingual (VI / EN). Language controlled by `src/context/LanguageContext.tsx`.

All user-facing strings live in `src/translations.ts`. Key role options for the contact dropdown:

| Key | VI | EN |
|---|---|---|
| `optRole1` | Mua gói Starter ($399) | Buy Starter Pack ($399) |
| `optRole2` | Mua Antigravity Suite ($1,499) | Buy Antigravity Suite ($1,499) |
| `optRole5` | Mua Google AI Pro 5TB 1 năm | Buy Google AI Pro 5TB 1 Year |
| `optRole6` | Tư vấn mua Laptop US | Inquire about Laptop US |

---

## ⚙️ Animations (defined in `src/index.css`)

| Class | Effect |
|---|---|
| `animate-glow-red` | Pulsing red box-shadow on banner |
| `animate-blink` | Opacity flicker on "Google AI Pro 5TB" text |
| `animate-ping` | Tailwind built-in — used for Zalo glow ring |

---

## 📦 Navbar Links

```ts
const navLinks = [
  { name: t('navAbout'),     href: '#about' },
  { name: t('navServices'),  href: '#services' },
  { name: t('navOffers'),    href: '#offers' },
  { name: t('navResources'), href: '#resources' },
  { name: t('navLaptop'),    href: '#/laptop-us' },  // ← opens subpage
];
```

> Logo (`href="#"`) resets hash → returns to homepage top.

---

## 📝 Last updated
2026-06-18 by Antigravity agent session `72c994ff-214d-41a8-aa67-c2a926fbb0df`
