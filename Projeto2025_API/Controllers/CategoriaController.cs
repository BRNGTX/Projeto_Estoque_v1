using Dominio.Dtos;
using FluentValidation;
using Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Projeto2025_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CategoriaController : ControllerBase
    {
        private ICategoriaService service;
        private IValidator<CategoriaDto> validacao;

        public CategoriaController(ICategoriaService service, IValidator<CategoriaDto> validacao)
        {
            this.service = service;
            this.validacao = validacao;
        }


        [HttpGet]
        public async Task<ActionResult<List<CategoriaDto>>> getAll() {
            return Ok(await service.listAsync(p => true));
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<CategoriaDto?>> getAsync(int id) {
            var cat =  await service.getAsync(id);
            if (cat == null)
                return NotFound();
            else return Ok(cat);
        }

        [HttpPost]
        public async Task<ActionResult<CategoriaDto>> save(CategoriaDto dto) {

            var result = validacao.Validate(dto);
            if (result.IsValid)
            {

                dto = await service.addAsync(dto);
             
                return Ok(dto);
            }
            else return BadRequest(result);
            }


        [HttpPut]
        public async Task<ActionResult> update(CategoriaDto dto) {
            var result = validacao.Validate(dto);
            if (result.IsValid)
            {
                var ret = await service.updateAsync(dto);
                if (ret)
                    return NoContent();
                else
                    return NotFound();
            }
            else return BadRequest(result);
        
        }


        [HttpDelete("{id:int}")]
        public async Task<ActionResult> delete(int id)
        {

            var ret = await service.deleteAsync(id);
            if (ret)
                return NoContent();
            else
                return NotFound();
        }

        [HttpGet("{nome}")]
        public async Task<ActionResult<List<CategoriaDto>>> lista(string nome) {
            return  Ok(await service.listAsync(p => p.Descricao.Contains(nome)));
        
        }


    }



}
