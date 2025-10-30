using AutoMapper;
using Dominio.Dtos;
using Dominio.Entidades;
using Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Service
{
    public class RelatorioService : IRelatorioService
    {
        private readonly IMovimentacaoRepositorio movimentacaoRepositorio;
        private readonly IProdutoRepositorio produtoRepositorio;
        private readonly ICategoriaRepositorio categoriaRepositorio;
        private readonly IMapper mapper;

        public RelatorioService(
            IMovimentacaoRepositorio movimentacaoRepositorio,
            IProdutoRepositorio produtoRepositorio,
            ICategoriaRepositorio categoriaRepositorio,
            IMapper mapper)
        {
            this.movimentacaoRepositorio = movimentacaoRepositorio;
            this.produtoRepositorio = produtoRepositorio;
            this.categoriaRepositorio = categoriaRepositorio;
            this.mapper = mapper;
        }

        public async Task<RelatorioMovimentacoesDto> GetRelatorioMovimentacoes(DateTime dataInicio, DateTime dataFim)
        {
            // Ajustar para considerar até 23:59:59.9999999 de dataFim
            var dataFimComHora = dataFim.Date.AddDays(1).AddTicks(-1);

            var movimentacoes = await movimentacaoRepositorio.listAsync(m => 
                m.Data >= dataInicio.Date && m.Data <= dataFimComHora);

            var entradas = movimentacoes
                .Where(m => m.Tipo == "Entrada")
                .ToList();

            var saidas = movimentacoes
                .Where(m => m.Tipo == "Saída")
                .ToList();

            return new RelatorioMovimentacoesDto
            {
                DataInicio = dataInicio,
                DataFim = dataFim,
                TotalEntradas = entradas.Sum(m => m.Quantidade),
                TotalSaidas = saidas.Sum(m => m.Quantidade),
                TotalMovimentacoes = movimentacoes.Count,
                Movimentacoes = mapper.Map<List<MovimentacaoEstoqueDto>>(movimentacoes)
            };
        }

        public async Task<List<RelatorioCategoriasDto>> GetRelatorioCategorias()
        {
            var categorias = await categoriaRepositorio.listAsync(c => true);
            var produtos = await produtoRepositorio.listAsync(p => true);

            var resultado = new List<RelatorioCategoriasDto>();

            foreach (var categoria in categorias)
            {
                var produtosDaCategoria = produtos.Where(p => p.IdCategoria == categoria.Id).ToList();
                var quantidadeTotalEstoque = produtosDaCategoria.Sum(p => p.Quantidade);
                var valorTotalEstoque = produtosDaCategoria.Sum(p => p.Quantidade * p.Valor);

                resultado.Add(new RelatorioCategoriasDto
                {
                    IdCategoria = categoria.Id,
                    NomeCategoria = categoria.Descricao,
                    TotalProdutos = produtosDaCategoria.Count,
                    QuantidadeTotalEstoque = quantidadeTotalEstoque,
                    ValorTotalEstoque = valorTotalEstoque,
                    Produtos = mapper.Map<List<ProdutoDto>>(produtosDaCategoria)
                });
            }

            return resultado;
        }

        public async Task<List<RelatorioProdutosDto>> GetRelatorioProdutos()
        {
            var produtos = await produtoRepositorio.listAsync(p => true);

            var resultado = produtos.Select(p => new RelatorioProdutosDto
            {
                Id = p.Id,
                Descricao = p.Descricao,
                Categoria = p.Categoria?.Descricao ?? "Sem categoria",
                Quantidade = p.Quantidade,
                Valor = p.Valor,
                ValorTotal = p.Quantidade * p.Valor,
                Status = p.Quantidade == 0 ? "Sem Estoque" : 
                         p.Quantidade < 5 ? "Estoque Baixo" : "Normal"
            }).OrderBy(p => p.Quantidade).ToList();

            return resultado;
        }

        public async Task<RelatorioSinteticoDto> GetRelatorioSintetico()
        {
            var produtos = await produtoRepositorio.listAsync(p => true);
            var movimentacoes = await movimentacaoRepositorio.listAsync(m => true);

            var valorTotalEstoque = produtos.Sum(p => p.Quantidade * p.Valor);
            var totalProdutos = produtos.Count;
            var produtosSemEstoque = produtos.Count(p => p.Quantidade == 0);
            var produtosBaixoEstoque = produtos.Count(p => p.Quantidade > 0 && p.Quantidade < 5);

            var movimentacoesHoje = movimentacoes
                .Where(m => m.Data.Date == DateTime.Now.Date)
                .ToList();

            return new RelatorioSinteticoDto
            {
                DataRelatorio = DateTime.Now,
                TotalProdutos = totalProdutos,
                ProdutosSemEstoque = produtosSemEstoque,
                ProdutosBaixoEstoque = produtosBaixoEstoque,
                ValorTotalEstoque = valorTotalEstoque,
                MovimentacoesHoje = movimentacoesHoje.Count,
                EntradasyHoje = movimentacoesHoje.Where(m => m.Tipo == "Entrada").Sum(m => m.Quantidade),
                SaidasHoje = movimentacoesHoje.Where(m => m.Tipo == "Saída").Sum(m => m.Quantidade)
            };
        }
    }
}
