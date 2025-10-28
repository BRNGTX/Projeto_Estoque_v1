using Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Projeto2025_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class RelatorioController : ControllerBase
    {
        private readonly IRelatorioService relatorioService;

        public RelatorioController(IRelatorioService relatorioService)
        {
            this.relatorioService = relatorioService;
        }

        /// <summary>
        /// Obter relatório de movimentações por período
        /// </summary>
        /// <param name="dataInicio">Data inicial do período</param>
        /// <param name="dataFim">Data final do período</param>
        /// <returns>Relatório com movimentações, totais de entradas/saídas</returns>
        [HttpGet("movimentacoes")]
        public async Task<ActionResult> GetRelatorioMovimentacoes([FromQuery] DateTime dataInicio, [FromQuery] DateTime dataFim)
        {
            try
            {
                var relatorio = await relatorioService.GetRelatorioMovimentacoes(dataInicio, dataFim);
                return Ok(relatorio);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// Obter relatório de produtos por categoria
        /// </summary>
        /// <returns>Relatório com análise de estoque por categoria</returns>
        [HttpGet("categorias")]
        public async Task<ActionResult> GetRelatorioCategorias()
        {
            try
            {
                var relatorio = await relatorioService.GetRelatorioCategorias();
                return Ok(relatorio);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// Obter relatório detalhado de todos os produtos
        /// </summary>
        /// <returns>Relatório com status e valor total de cada produto</returns>
        [HttpGet("produtos")]
        public async Task<ActionResult> GetRelatorioProdutos()
        {
            try
            {
                var relatorio = await relatorioService.GetRelatorioProdutos();
                return Ok(relatorio);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// Obter relatório sintético/dashboard
        /// </summary>
        /// <returns>Resumo geral do estoque e movimentações do dia</returns>
        [HttpGet("sintetico")]
        public async Task<ActionResult> GetRelatorioSintetico()
        {
            try
            {
                var relatorio = await relatorioService.GetRelatorioSintetico();
                return Ok(relatorio);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
