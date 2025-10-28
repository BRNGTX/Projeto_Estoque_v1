using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dominio.Dtos
{
    public class MovimentacaoEstoqueDto
    {
        public int Id { get; set; }
        public int IdProduto { get; set; }
        public string Tipo { get; set; } = string.Empty;
        public int Quantidade { get; set; }
        public DateTime Data { get; set; }
        public string Observacao { get; set; } = string.Empty;
        public ProdutoDto? Produto { get; set; }
    }
}


