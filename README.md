# CollectGames 🎮

Applicazione full-stack per gestire la tua collezione di videogiochi con stile retrò Super Nintendo.

## 🚀 Quick Start

### Avvio Rapido (Windows)

Doppio click su `start.bat` - avvierà automaticamente backend e frontend!

### Avvio Manuale

**Backend:**
```bash
cd backend/CollectGames.Backend
dotnet run
```

**Frontend:**
```bash
cd frontend
npm install  # solo la prima volta
npm run dev
```

Poi apri [http://localhost:5173](http://localhost:5173)

## 📁 Struttura Progetto

```
collect-games/
├── backend/                 # ASP.NET Core Web API
│   └── CollectGames.Backend/
│       ├── Controllers/     # API endpoints
│       ├── Models/          # Database models
│       ├── Services/        # Business logic
│       └── wwwroot/         # Static files
├── frontend/                # React + Vite
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # API integration
│   │   └── assets/          # Console icons
│   └── README.md            # Frontend docs
├── start.bat                # Avvio rapido (Windows)
└── README.md                # Questo file
```

## ✨ Features

### Backend (ASP.NET Core)
- ✅ RESTful API
- ✅ Entity Framework Core + SQL Server
- ✅ Upload immagini
- ✅ CRUD completo per giochi e console
- ✅ Swagger UI per testing

### Frontend (React + Vite)
- 🎨 Design retrò Super Nintendo
- ⚡ Performance ottimizzate
- ♿ WCAG 2.1 AA compliant
- 📱 Responsive design
- 🎬 Animazioni Framer Motion
- 🎯 21 icone console integrate
- 🔍 Filtri e ricerca real-time

## 🛠️ Tech Stack

| Layer | Tecnologie |
|-------|-----------|
| **Backend** | ASP.NET Core 8, Entity Framework Core, SQL Server |
| **Frontend** | React 18, TypeScript, Vite, Framer Motion |
| **Styling** | CSS Modules, Google Fonts (Press Start 2P) |
| **Icons** | Lucide React |
| **HTTP** | Axios |

## 📦 Prerequisiti

- **.NET 8 SDK** - [Download](https://dotnet.microsoft.com/download)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **SQL Server** (LocalDB o Express)

## 🔧 Setup Completo

### 1. Backend Setup

```bash
cd backend/CollectGames.Backend

# Ripristina pacchetti
dotnet restore

# Applica migrations
dotnet ef database update

# Avvia server
dotnet run
```

Backend disponibile su: `https://localhost:7154`

### 2. Frontend Setup

```bash
cd frontend

# Installa dipendenze
npm install

# Avvia dev server
npm run dev
```

Frontend disponibile su: `http://localhost:5173`

## 🎮 Utilizzo

1. **Avvia l'applicazione** con `start.bat` o manualmente
2. **Apri il browser** su http://localhost:5173
3. **Aggiungi console** (opzionale) tramite API `/api/Consoles`
4. **Aggiungi giochi** cliccando "Add Game"
5. **Filtra e cerca** nella tua collezione

## 📸 Screenshots

### Home Page
Design retrò con palette Super Nintendo, bordi pixel-art e animazioni fluide.

### Game Card
Ogni gioco mostra:
- Immagine (o placeholder)
- Icona console
- Condizione (Loose/CIB/Sealed)
- Prezzo pagato
- Data acquisto
- Note

### Add Game Modal
Form completo con:
- Upload immagine con preview
- Select console con icone
- Validazione campi
- Focus trap accessibile

## 🔌 API Endpoints

### User Collection
- `GET /api/UserCollection` - Lista collezione
- `POST /api/UserCollection` - Aggiungi gioco

### Consoles
- `GET /api/Consoles` - Lista console
- `POST /api/Consoles` - Aggiungi console
- `PUT /api/Consoles/{id}` - Modifica console
- `DELETE /api/Consoles/{id}` - Elimina console

Swagger UI: `https://localhost:7154/swagger`

## 🎨 Console Supportate

21 console con icone pixel-art:
- Nintendo: NES, SNES, N64, GameCube, GB, GBC, GBA, NDS
- Sony: PS1, PS2, PSP, PS Vita
- Sega: Master System, Mega Drive, Saturn, Dreamcast
- Altri: PC Engine, Neo Geo Pocket Color, Atari Lynx, WonderSwan, MAME

## 🐛 Troubleshooting

### Backend non si avvia
- Verifica che SQL Server sia in esecuzione
- Controlla la connection string in `appsettings.json`
- Esegui `dotnet ef database update`

### Frontend non si connette
- Verifica che il backend sia su `https://localhost:7154`
- Controlla CORS in `Program.cs`
- Verifica `API_BASE_URL` in `frontend/src/services/api.ts`

### Porte già in uso
- Backend: Cambia porta in `Properties/launchSettings.json`
- Frontend: Usa `npm run dev -- --port 3000`

## 📝 Scripts Utili

### Backend
```bash
dotnet run                    # Avvia server
dotnet ef migrations add Name # Crea migration
dotnet ef database update     # Applica migrations
dotnet build                  # Build progetto
```

### Frontend
```bash
npm run dev      # Dev server
npm run build    # Production build
npm run preview  # Preview build
npm run lint     # ESLint check
```

## 🚀 Deployment

### Backend
- Azure App Service
- Docker container
- IIS (Windows Server)

### Frontend
- Vercel (consigliato)
- Netlify
- GitHub Pages

## 📄 License

MIT

## �‍💻 Author

**Made by Biagio Scaglia**

Full-stack developer passionate about retro gaming and modern web technologies.

- 🎮 Retro gaming enthusiast
- 💻 ASP.NET Core & React specialist
- 🎨 UI/UX design lover

## 🙏 Credits

- **Font**: Press Start 2P by CodeMan38
- **Icons**: Lucide Icons
- **Console Images**: Retro gaming community
- **Design Inspiration**: Super Nintendo Entertainment System

---

<div align="center">

**Made with ♥ by Biagio for retro gaming collectors**

*CollectGames © 2026*

</div>
