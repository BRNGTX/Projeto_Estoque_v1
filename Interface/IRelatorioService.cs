using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Dominio.Dtos;

namespace Interface
{
    public interface IRelatorioService
    {
        Task<RelatorioMovimentacoesDto> GetRelatorioMovimentacoes(DateTime dataInicio, DateTime dataFim);
        Task<List<RelatorioCategoriasDto>> GetRelatorioCategorias();
        Task<List<RelatorioProdutosDto>> GetRelatorioProdutos();
        Task<RelatorioSinteticoDto> GetRelatorioSintetico();
    }
}
