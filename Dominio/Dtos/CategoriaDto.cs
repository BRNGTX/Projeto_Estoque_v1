using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dominio.Dtos
{
    public class CategoriaDto
    {
        public int Id { get; set; }
        public string Descricao { get; set; } = String.Empty;
        public string DescricaoDetalhada { get; set; }
    }
}
