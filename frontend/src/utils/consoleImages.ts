// Console images mapping
import DC from '../assets/console/DC.png';
import GB from '../assets/console/GB.png';
import GBA from '../assets/console/GBA.png';
import GBC_1 from '../assets/console/GBC_1.png';
import GC from '../assets/console/GC.png';
import LYNX from '../assets/console/LYNX.png';
import MAME from '../assets/console/MAME.png';
import MD_GEN from '../assets/console/MD_GEN.png';
import N64 from '../assets/console/N64.png';
import NDS from '../assets/console/NDS.png';
import NES from '../assets/console/NES.png';
import NGPC from '../assets/console/NGPC.png';
import PCE from '../assets/console/PCE.png';
import PS1 from '../assets/console/PS1.png';
import PS2 from '../assets/console/PS2.png';
import PSP from '../assets/console/PSP.png';
import SAT_1 from '../assets/console/SAT_1.png';
import SMS from '../assets/console/SMS.png';
import SNES from '../assets/console/SNES.png';
import VITA from '../assets/console/VITA.png';
import WS from '../assets/console/WS.png';

export const consoleImages: Record<string, string> = {
    'Dreamcast': DC,
    'DC': DC,
    'Game Boy': GB,
    'GB': GB,
    'Game Boy Advance': GBA,
    'GBA': GBA,
    'Game Boy Color': GBC_1,
    'GBC': GBC_1,
    'GameCube': GC,
    'GC': GC,
    'Atari Lynx': LYNX,
    'LYNX': LYNX,
    'MAME': MAME,
    'Arcade': MAME,
    'Mega Drive': MD_GEN,
    'Genesis': MD_GEN,
    'MD': MD_GEN,
    'Nintendo 64': N64,
    'N64': N64,
    'Nintendo DS': NDS,
    'NDS': NDS,
    'NES': NES,
    'Nintendo Entertainment System': NES,
    'Neo Geo Pocket Color': NGPC,
    'NGPC': NGPC,
    'PC Engine': PCE,
    'PCE': PCE,
    'TurboGrafx-16': PCE,
    'PlayStation': PS1,
    'PS1': PS1,
    'PSX': PS1,
    'PlayStation 2': PS2,
    'PS2': PS2,
    'PSP': PSP,
    'PlayStation Portable': PSP,
    'Saturn': SAT_1,
    'SAT': SAT_1,
    'Sega Saturn': SAT_1,
    'Master System': SMS,
    'SMS': SMS,
    'Sega Master System': SMS,
    'Super Nintendo': SNES,
    'SNES': SNES,
    'Super Famicom': SNES,
    'PS Vita': VITA,
    'VITA': VITA,
    'WonderSwan': WS,
    'WS': WS,
};

export function getConsoleImage(platform: string): string | null {
    return consoleImages[platform] || null;
}
