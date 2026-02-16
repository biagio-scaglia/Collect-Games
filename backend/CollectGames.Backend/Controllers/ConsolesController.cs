using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CollectGames.Backend.Data;
using ConsoleModel = CollectGames.Backend.Models.Console;

namespace CollectGames.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConsolesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ConsolesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Consoles
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ConsoleModel>>> GetConsoles()
        {
            return await _context.Consoles.ToListAsync();
        }

        // GET: api/Consoles/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ConsoleModel>> GetConsole(int id)
        {
            var console = await _context.Consoles.FindAsync(id);

            if (console == null)
            {
                return NotFound();
            }

            return console;
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> PutConsole(int id, ConsoleModel console)
        {
            if (id != console.Id)
            {
                return BadRequest();
            }

            _context.Entry(console).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ConsoleExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Consoles
        [HttpPost]
        public async Task<ActionResult<ConsoleModel>> PostConsole(ConsoleModel console)
        {
            _context.Consoles.Add(console);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetConsole", new { id = console.Id }, console);
        }

        // DELETE: api/Consoles/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteConsole(int id)
        {
            var console = await _context.Consoles.FindAsync(id);
            if (console == null)
            {
                return NotFound();
            }

            _context.Consoles.Remove(console);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ConsoleExists(int id)
        {
            return _context.Consoles.Any(e => e.Id == id);
        }
    }
}
