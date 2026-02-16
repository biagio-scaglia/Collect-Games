# CollectGames - Quick Reference 🎮

## 🚀 Avvio Rapido

### Opzione 1: Script Automatico (Consigliato)
```bash
# Dalla cartella principale
.\start.bat
```

### Opzione 2: Manuale
```bash
# Backend (Terminal 1)
cd backend\CollectGames.Backend
dotnet run --urls "http://localhost:5000"

# Frontend (Terminal 2)
cd frontend
npm run dev
```

## 📋 Comandi Utili

### Backend
```bash
dotnet run --urls "http://localhost:5000"  # Avvia backend
dotnet ef database update                   # Aggiorna database
.\backend\seed-consoles.ps1                 # Popola console (solo prima volta)
```

### Frontend
```bash
npm run dev      # Dev server (http://localhost:5173)
npm run build    # Build production
npm run preview  # Preview build
```

## 🔗 URL Importanti

- **Frontend**: http://localhost:5173 (o 5174/5175 se occupata)
- **Backend API**: http://localhost:5000/api
- **Swagger**: http://localhost:5000/swagger

## 📁 Struttura Progetto

```
collect-games/
├── backend/
│   ├── CollectGames.Backend/    # ASP.NET Core API
│   └── seed-consoles.ps1        # Script popolamento console
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── hooks/               # Custom hooks
│   │   ├── services/            # API integration
│   │   ├── utils/               # Console images mapping
│   │   └── assets/console/      # 21 console icons
│   └── README.md                # Documentazione dettagliata
├── start.bat                    # Avvio automatico
└── README.md                    # Documentazione principale
```

## 🎨 Features

- ✅ Design retrò Super Nintendo
- ✅ 21 console con icone pixel-art
- ✅ Responsive (mobile/tablet/desktop)
- ✅ Accessibilità WCAG 2.1 AA
- ✅ Animazioni Framer Motion
- ✅ Upload immagini
- ✅ Filtri e ricerca real-time

## 🐛 Troubleshooting

**Porta già in uso?**
- Backend: Cambia porta in `start.bat` o usa `--urls "http://localhost:XXXX"`
- Frontend: Vite cambierà automaticamente porta (5174, 5175, etc.)

**Console non appaiono?**
- Esegui: `.\backend\seed-consoles.ps1`

**Errori CORS?**
- Verifica che backend sia su porta 5000
- Frontend configurato per http://localhost:5000/api

## 📝 Note

- **Prima esecuzione**: Esegui `npm install` in `frontend/`
- **Database**: SQL Server LocalDB (configurato automaticamente)
- **Console**: 21 piattaforme pre-configurate (Nintendo, Sony, Sega, etc.)

---

<div align="center">

**Made with ♥ by Biagio Scaglia**

*CollectGames © 2026*

</div>
