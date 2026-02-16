# CollectGames 🎮

Applicazione full-stack per gestire la tua collezione di videogiochi con stile retrò Super Nintendo, potenziata con le ultime tecnologie per performance e scalabilità.

## 🐳 Docker & Infrastructure

Il progetto è completamente containerizzato e pronto per il cloud, includendo ora il caching distribuito.

### Local Development (Docker Compose)
Per avviare l'intero stack (Frontend, Backend, SQL Server, Redis) in locale:
```bash
docker compose up --build
```
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:5000
- **Scalar API Doc**: http://localhost:5000/scalar/v1
- **Redis Cache**: Port 6379

### Kubernetes (Scaling)
I manifesti sono disponibili nella cartella `/k8s`.
```bash
kubectl apply -f k8s/
```
Include ora:
- **MSSQL**: Database primario.
- **Redis**: Cache distribuita per performance elevate.
- **Backend & Frontend**: Scalabili con più repliche.

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
npm install
npm run dev
```

## ✨ Features & Tech Stack

### Backend (ASP.NET Core 10.0)
- **Serilog**: Logging strutturato su console e file.
- **Redis**: Caching distribuito per query ultra-veloci.
- **QuestPDF**: Generazione report della collezione in formato PDF.
- **FluentValidation**: Validazione DTO pulita e separata dalla business logic.
- **Mapster**: Mapping automatico tra DTO e modelli Entity Framework.
- **Polly**: Politiche di resilienza (Retry) per le operazioni su database.
- **Scalar UI**: Documentazione API interattiva e moderna.

### Frontend (React + TypeScript)
- **TanStack Router**: Routing type-safe con gestione avanzata degli stati.
- **TanStack Query**: Data fetching asincrono con caching e revalidazione automatica.
- **Radix UI**: Componenti accessibili (Tabs, Dialog) per un'esperienza utente premium.
- **React Hook Form + Zod**: Gestione form complessi con validazione schema-based.
- **Framer Motion**: Animazioni fluida e transizioni SNS-style.

## 📁 Struttura Progetto
```
collect-games/
├── backend/                 # ASP.NET Core Web API
├── frontend/                # React + Vite (TS)
├── k8s/                     # Manifesti Kubernetes (MSSQL, Redis, App)
├── docker-compose.yml       # Orchestrazione locale
└── start.bat                # Script di avvio rapido
```

## 🔌 API Documentation
Accedi alla documentazione interattiva Scalar (migliore di Swagger!) quando il backend è in esecuzione:
`http://localhost:5000/scalar/v1`

## 🎮 Utilizzo
1. **Esporta in PDF**: Usa il pulsante "Export PDF" nell'header per scaricare la tua collezione.
2. **Gestione Wishlist**: Aggiungi giochi alla lista dei desideri e monitora i prezzi.
3. **Recensioni**: Valuta i tuoi giochi con il sistema a stelle integrato.
4. **Filtri Pixel-Perfect**: Filtra per console o condizione (Loose, CIB, Sealed).

---
**Made with ♥ by Biagio Scaglia**
*Retro gaming enthusiast & Software Engineer*
