# Script to seed console data via API
$baseUrl = "http://localhost:5000/api/Consoles"

$consoles = @(
    @{ Name = "NES"; Manufacturer = "Nintendo"; Type = "Home Console"; ReleaseYear = 1983; ImageName = "NES.png" },
    @{ Name = "SNES"; Manufacturer = "Nintendo"; Type = "Home Console"; ReleaseYear = 1990; ImageName = "SNES.png" },
    @{ Name = "Nintendo 64"; Manufacturer = "Nintendo"; Type = "Home Console"; ReleaseYear = 1996; ImageName = "N64.png" },
    @{ Name = "GameCube"; Manufacturer = "Nintendo"; Type = "Home Console"; ReleaseYear = 2001; ImageName = "GC.png" },
    @{ Name = "Game Boy"; Manufacturer = "Nintendo"; Type = "Handheld"; ReleaseYear = 1989; ImageName = "GB.png" },
    @{ Name = "Game Boy Color"; Manufacturer = "Nintendo"; Type = "Handheld"; ReleaseYear = 1998; ImageName = "GBC_1.png" },
    @{ Name = "Game Boy Advance"; Manufacturer = "Nintendo"; Type = "Handheld"; ReleaseYear = 2001; ImageName = "GBA.png" },
    @{ Name = "Nintendo DS"; Manufacturer = "Nintendo"; Type = "Handheld"; ReleaseYear = 2004; ImageName = "NDS.png" },
    @{ Name = "PlayStation"; Manufacturer = "Sony"; Type = "Home Console"; ReleaseYear = 1994; ImageName = "PS1.png" },
    @{ Name = "PlayStation 2"; Manufacturer = "Sony"; Type = "Home Console"; ReleaseYear = 2000; ImageName = "PS2.png" },
    @{ Name = "PSP"; Manufacturer = "Sony"; Type = "Handheld"; ReleaseYear = 2004; ImageName = "PSP.png" },
    @{ Name = "PS Vita"; Manufacturer = "Sony"; Type = "Handheld"; ReleaseYear = 2011; ImageName = "VITA.png" },
    @{ Name = "Master System"; Manufacturer = "Sega"; Type = "Home Console"; ReleaseYear = 1985; ImageName = "SMS.png" },
    @{ Name = "Mega Drive"; Manufacturer = "Sega"; Type = "Home Console"; ReleaseYear = 1988; ImageName = "MD_GEN.png" },
    @{ Name = "Saturn"; Manufacturer = "Sega"; Type = "Home Console"; ReleaseYear = 1994; ImageName = "SAT_1.png" },
    @{ Name = "Dreamcast"; Manufacturer = "Sega"; Type = "Home Console"; ReleaseYear = 1998; ImageName = "DC.png" },
    @{ Name = "PC Engine"; Manufacturer = "NEC"; Type = "Home Console"; ReleaseYear = 1987; ImageName = "PCE.png" },
    @{ Name = "Neo Geo Pocket Color"; Manufacturer = "SNK"; Type = "Handheld"; ReleaseYear = 1999; ImageName = "NGPC.png" },
    @{ Name = "Atari Lynx"; Manufacturer = "Atari"; Type = "Handheld"; ReleaseYear = 1989; ImageName = "LYNX.png" },
    @{ Name = "WonderSwan"; Manufacturer = "Bandai"; Type = "Handheld"; ReleaseYear = 1999; ImageName = "WS.png" },
    @{ Name = "Arcade"; Manufacturer = "Various"; Type = "Arcade"; ReleaseYear = 1970; ImageName = "MAME.png" }
)

Write-Host "🎮 Seeding console data..." -ForegroundColor Cyan
Write-Host ""

$successCount = 0
$errorCount = 0

foreach ($console in $consoles) {
    try {
        $json = $console | ConvertTo-Json
        $response = Invoke-RestMethod -Uri $baseUrl -Method Post -Body $json -ContentType "application/json"
        Write-Host "✅ Added: $($console.Name)" -ForegroundColor Green
        $successCount++
    }
    catch {
        Write-Host "❌ Failed: $($console.Name) - $($_.Exception.Message)" -ForegroundColor Red
        $errorCount++
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Seeding Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ Success: $successCount" -ForegroundColor Green
Write-Host "❌ Errors: $errorCount" -ForegroundColor Red
Write-Host ""
