using System;
using System.Collections.Generic;

namespace Dominio.Dtos
{
    public class RelatorioMovimentacoesDto
    {
        public DateTime DataInicio { get; set; }
        public DateTime DataFim { get; set; }
        public int TotalEntradas { get; set; }
        public int TotalSaidas { get; set; }
        public int TotalMovimentacoes { get; set; }
        public List<MovimentacaoEstoqueDto> Movimentacoes { get; set; }
    }

    public class RelatorioCategoriasDto
    {
        public int IdCategoria { get; set; }
        public string NomeCategoria { get; set; }
        public int TotalProdutos { get; set; }
        public int QuantidadeTotalEstoque { get; set; }
        public decimal ValorTotalEstoque { get; set; }
        public List<ProdutoDto> Produtos { get; set; }
    }

    public class RelatorioProdutosDto
    {
        public int Id { get; set; }
        public string Descricao { get; set; }
        public string Categoria { get; set; }
        public int Quantidade { get; set; }
        public decimal Valor { get; set; }
        public decimal ValorTotal { get; set; }
        public string Status { get; set; }
    }

    public class RelatorioSinteticoDto
    {
        public DateTime DataRelatorio { get; set; }
        public int TotalProdutos { get; set; }
        public int ProdutosSemEstoque { get; set; }
        public int ProdutosBaixoEstoque { get; set; }
        public decimal ValorTotalEstoque { get; set; }
        public int MovimentacoesHoje { get; set; }
        public int EntradasyHoje { get; set; }
        public int SaidasHoje { get; set; }
    }
}
