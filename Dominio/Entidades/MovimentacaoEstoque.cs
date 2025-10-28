using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dominio.Entidades
{
    public class MovimentacaoEstoque
    {
        public int Id { get; set; }
        public int IdProduto { get; set; }
        public Produto? Produto { get; set; }
        public string Tipo { get; set; } = string.Empty; // "Entrada" ou "Saída"
        public int Quantidade { get; set; }
        public DateTime Data { get; set; }
        public string Observacao { get; set; } = string.Empty;
    }
}

