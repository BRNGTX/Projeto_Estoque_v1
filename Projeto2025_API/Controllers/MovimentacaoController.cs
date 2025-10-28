using Dominio.Dtos;
using Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Projeto2025_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MovimentacaoController : ControllerBase
    {
        private IMovimentacaoService service;

        public MovimentacaoController(IMovimentacaoService service)
        {
            this.service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<MovimentacaoEstoqueDto>>> GetAll()
        {
            return Ok(await service.listAsync(m => true));
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<MovimentacaoEstoqueDto?>> GetAsync(int id)
        {
            var mov = await service.getAsync(id);
            if (mov == null)
                return NotFound();
            return Ok(mov);
        }

        [HttpPost]
        public async Task<ActionResult<MovimentacaoEstoqueDto>> Save(MovimentacaoEstoqueDto dto)
        {
            try
            {
                dto = await service.addAsync(dto);
                return Ok(dto);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                var ret = await service.deleteAsync(id);
                if (ret)
                    return NoContent();
                return NotFound();
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("produto/{idProduto:int}")]
        public async Task<ActionResult<List<MovimentacaoEstoqueDto>>> GetByProduto(int idProduto)
        {
            return Ok(await service.listAsync(m => m.IdProduto == idProduto));
        }

        [HttpGet("tipo/{tipo}")]
        public async Task<ActionResult<List<MovimentacaoEstoqueDto>>> GetByTipo(string tipo)
        {
            return Ok(await service.listAsync(m => m.Tipo == tipo));
        }
    }
}

