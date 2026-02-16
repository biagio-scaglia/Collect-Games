# CollectGames Frontend 🎮

Frontend React moderno con estetica retrò Super Nintendo per gestire la tua collezione di videogiochi.

![SNES Style](https://img.shields.io/badge/Style-Super_Nintendo-7B5FA6?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![WCAG 2.1 AA](https://img.shields.io/badge/WCAG-2.1_AA-4CAF50?style=for-the-badge)

## ✨ Features

- 🎨 **Design Retrò SNES**: Palette viola/giallo autentica, font pixel-art, bordi 16-bit
- ⚡ **Performance**: Code splitting, lazy loading, bundle < 200KB
- ♿ **Accessibilità**: WCAG 2.1 AA compliant, keyboard navigation, screen reader friendly
- 📱 **Responsive**: Mobile-first design, 3 breakpoints (640px, 768px, 1024px)
- 🎬 **Animazioni**: Framer Motion con supporto `prefers-reduced-motion`
- 🎯 **Icone Console**: 21 console icons integrate (SNES, PS1, N64, etc.)
- 🔍 **Filtri Real-time**: Ricerca con debounce, filtri piattaforma/condizione
- 📤 **Upload Immagini**: Drag & drop con preview

## 🚀 Quick Start

### Prerequisiti

- Node.js 18+ 
- npm 9+
- Backend ASP.NET in esecuzione su `https://localhost:7154`

### Installazione

```bash
# Clona il repository (se non l'hai già fatto)
cd frontend

# Installa dipendenze
npm install

# Avvia dev server
npm run dev
```

Apri [http://localhost:5173](http://localhost:5173) nel browser.

## 📦 Stack Tecnologico

| Tecnologia | Versione | Uso |
|------------|----------|-----|
| **React** | 18 | UI library |
| **Vite** | 7 | Build tool & dev server |
| **TypeScript** | 5 | Type safety |
| **Framer Motion** | 11 | Animazioni |
| **Lucide React** | Latest | Icone moderne |
| **Axios** | 1.6 | HTTP client |
| **CSS Modules** | - | Scoped styling |

## 🎨 Design System

### Palette Colori SNES

```css
--snes-purple: #7B5FA6;      /* Primario */
--snes-purple-dark: #4A3764; /* Bordi scuri */
--snes-yellow: #F4D03F;      /* Call-to-action */
--snes-gray: #C8C8D2;        /* Secondario */
--snes-bg: #2D2640;          /* Background */
```

Tutti i colori sono **WCAG 2.1 AA compliant** (contrasto ≥ 4.5:1).

### Typography

- **Pixel Font**: "Press Start 2P" (titoli, UI)
- **Body Font**: "Inter" (testi lunghi)

### Spacing

Base 8px: `4px, 8px, 16px, 24px, 32px, 48px, 64px`

## 📁 Struttura Progetto

```
src/
├── components/          # Componenti React
│   ├── Header.tsx
│   ├── GameCard.tsx
│   ├── Filters.tsx
│   └── AddGameModal.tsx
├── hooks/              # Custom hooks
│   ├── useCollection.ts
│   └── useConsoles.ts
├── services/           # API layer
│   └── api.ts
├── utils/              # Utilities
│   └── consoleImages.ts
├── assets/             # Immagini statiche
│   └── console/        # 21 console icons
├── types.ts            # TypeScript types
├── App.tsx             # Main component
└── index.css           # Global styles
```

## 🎮 Console Icons

21 console supportate con icone pixel-art:

- **Nintendo**: NES, SNES, N64, GameCube, GB, GBC, GBA, NDS
- **Sony**: PS1, PS2, PSP, PS Vita
- **Sega**: Master System, Mega Drive/Genesis, Saturn, Dreamcast
- **Altri**: PC Engine, Neo Geo Pocket Color, Atari Lynx, WonderSwan, MAME

Le icone vengono mostrate automaticamente nei badge piattaforma delle GameCard.

## 🔌 API Integration

### Endpoints Utilizzati

```typescript
GET  /api/UserCollection  // Fetch collezione
POST /api/UserCollection  // Aggiungi gioco (FormData)
GET  /api/Consoles        // Fetch console
```

### Configurazione

Base URL in `src/services/api.ts`:

```typescript
const API_BASE_URL = 'https://localhost:7154/api';
```

## ♿ Accessibilità

### Keyboard Navigation

- `Tab` / `Shift+Tab`: Navigazione elementi
- `Enter`: Aprire modale / Submit form
- `Escape`: Chiudere modale
- `Space`: Toggle checkbox/radio

### Screen Reader

- Tutti gli elementi interattivi hanno `aria-label`
- Form con `<label>` associati
- Stati loading/error con `role="status"` / `role="alert"`
- Immagini decorative con `aria-hidden="true"`

### Focus Management

- Outline giallo 3px su tutti gli elementi focusabili
- Focus trap nella modale
- Skip link per saltare al contenuto principale

## 📱 Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 640px) { ... }

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) { ... }

/* Desktop */
@media (min-width: 1025px) { ... }
```

## 🎬 Animazioni

Tutte le animazioni rispettano `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  animation-duration: 0.01ms !important;
}
```

### Esempi

- **Header**: Slide-in dall'alto
- **GameCard**: Stagger animation (delay: index * 50ms)
- **Modal**: Fade-in overlay + scale-in content
- **Buttons**: Hover scale 1.05, tap scale 0.95

## 🧪 Testing

### Build Production

```bash
npm run build
npm run preview
```

### Lighthouse Audit

```bash
# Chrome DevTools > Lighthouse
# Target: Performance > 90, Accessibility > 95
```

### Test Accessibilità

1. **Keyboard**: Navigare solo con Tab/Enter/Escape
2. **Screen Reader**: Testare con NVDA (Windows) o VoiceOver (Mac)
3. **Contrasto**: Verificare con Chrome DevTools Accessibility panel

## 🐛 Troubleshooting

### CORS Errors

Assicurati che il backend abbia CORS configurato:

```csharp
// Program.cs
builder.Services.AddCors(options => {
    options.AddDefaultPolicy(policy => {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

app.UseCors();
```

### Immagini Non Caricate

Verifica che il backend serva file statici:

```csharp
app.UseStaticFiles();
```

### Console Icons Mancanti

Le immagini sono in `src/assets/console/`. Mapping in `src/utils/consoleImages.ts`.

## 📝 Scripts

```bash
npm run dev      # Dev server (port 5173)
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # ESLint check
```

## 🚀 Deployment

### Build

```bash
npm run build
```

Output in `dist/`. Deploy su:
- **Vercel**: `vercel deploy`
- **Netlify**: Drag & drop `dist/`
- **GitHub Pages**: `npm run build && gh-pages -d dist`

### Environment Variables

Crea `.env.production`:

```env
VITE_API_BASE_URL=https://your-api.com/api
```

Usa in codice:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
```

## 🎯 Roadmap

- [ ] Edit/Delete giochi
- [ ] Sorting (prezzo, data, titolo)
- [ ] Dark/Light mode toggle
- [ ] PWA support (offline)
- [ ] Unit tests (Jest + RTL)
- [ ] E2E tests (Playwright)

## 📄 License

MIT

## 👨‍💻 Author

**Made by Biagio Scaglia**

## 🙏 Credits

- **Font**: Press Start 2P by CodeMan38
- **Icons**: Lucide Icons
- **Console Images**: Retro gaming community
- **Design Inspiration**: Super Nintendo Entertainment System

---

<div align="center">

**Made with ♥ by Biagio**

*CollectGames Frontend © 2026*

</div>
