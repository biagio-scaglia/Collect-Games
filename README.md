# CollectGames 🎮

Applicazione full-stack per gestire la tua collezione di videogiochi con stile retrò Super Nintendo, potenziata con le ultime tecnologie per performance, scalabilità e real-time capabilities.

## 🐳 Docker & Infrastructure

Il progetto è completamente containerizzato e pronto per il cloud, includendo caching distribuito e background jobs.

### Local Development (Docker Compose)
Per avviare l'intero stack (Frontend, Backend, SQL Server, Redis) in locale:
```bash
docker compose up --build
```
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:5000
- **Scalar API Doc**: http://localhost:5000/scalar/v1
- **Hangfire Dashboard**: http://localhost:5000/hangfire
- **Redis Cache**: Port 6379

### Kubernetes (Scaling)
I manifesti sono disponibili nella cartella `/k8s`.
```bash
kubectl apply -f k8s/
```

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
- **MediatR**: Pattern CQRS per separare comandi e query
- **Hangfire**: Background jobs schedulati (cache warmup, image cleanup)
- **SignalR**: Notifiche real-time per aggiornamenti collezione
- **Serilog**: Logging strutturato su console e file
- **Redis**: Caching distribuito per query ultra-veloci
- **QuestPDF**: Generazione report PDF (collezione e wishlist)
- **FluentValidation**: Validazione DTO pulita
- **Mapster**: Mapping automatico DTO ↔ Models
- **Polly**: Retry policies per resilienza
- **Scalar UI**: Documentazione API interattiva

### Frontend (React + TypeScript)
- **TanStack Router**: Routing type-safe
- **TanStack Query**: Data fetching con caching automatico
- **Radix UI**: Componenti accessibili (Tabs, Dialog)
- **React Hook Form + Zod**: Form validation schema-based
- **React Hot Toast**: Notifiche toast eleganti
- **Recharts**: Dashboard statistiche con grafici
- **Zustand**: State management leggero
- **Framer Motion**: Animazioni fluide
- **Vitest**: Unit testing
- **Playwright**: E2E testing

## 📊 New Features

### Real-time Notifications
SignalR hub per notifiche istantanee quando la collezione viene modificata.

### Background Jobs
- **Cache Warmup**: Ogni ora (Hangfire)
- **Image Cleanup**: Giornaliero (Hangfire)

### Statistics Dashboard
Dashboard con grafici interattivi:
- Giochi per console (pie chart)
- Distribuzione condizioni (bar chart)
- Statistiche spesa totale

### PDF Export
Esporta collezione e wishlist in PDF con layout professionale.

## 🧪 Testing

```bash
# Unit tests (Vitest)
cd frontend
npm run test

# E2E tests (Playwright)
npx playwright test

# Backend tests
cd backend/CollectGames.Backend
dotnet test
```

## 🔌 API Documentation
- **Scalar UI**: http://localhost:5000/scalar/v1
- **Hangfire Dashboard**: http://localhost:5000/hangfire

## 📁 Struttura Progetto
```
collect-games/
├── backend/
│   ├── Handlers/         # MediatR CQRS handlers
│   ├── Jobs/             # Hangfire background jobs
│   ├── Hubs/             # SignalR hubs
│   └── ...
├── frontend/
│   ├── stores/           # Zustand state management
│   ├── components/       # React components + Stats Dashboard
│   └── e2e/              # Playwright tests
├── k8s/                  # Kubernetes manifests
└── docker-compose.yml
```

---
**Made with ♥ by Biagio Scaglia**
*Retro gaming enthusiast & Software Engineer*
