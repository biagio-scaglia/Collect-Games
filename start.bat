@echo off
echo ========================================
echo   CollectGames - Avvio Completo
echo ========================================
echo.

REM Colori per output
color 0A

echo [1/2] Avvio Backend ASP.NET...
echo.
start "CollectGames Backend" cmd /k "cd backend\CollectGames.Backend && dotnet run --urls http://localhost:5000"

REM Aspetta 3 secondi per dare tempo al backend di avviarsi
timeout /t 3 /nobreak >nul

echo [2/2] Avvio Frontend React + Vite...
echo.
start "CollectGames Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   Applicazione Avviata!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Premi un tasto per aprire il browser...
pause >nul

REM Apri il browser
start http://localhost:5173

echo.
echo Per fermare i server, chiudi le finestre del terminale.
echo.
pause
