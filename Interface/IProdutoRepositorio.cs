using Dominio.Dtos;
using Dominio.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Interface
{
    public interface IProdutoRepositorio
    {
        Task updateAsync(Produto dto);

        Task deleteAsync(Produto dto);
        Task<Produto?> getAsync(int id);
        Task<Produto?> getAsync(Expression<Func<Produto, bool>> expression);
        Task<List<Produto>> listAsync(Expression<Func<Produto, bool>> expression);
        Task<List<Produto>> listPagedAsync(Expression<Func<Produto, bool>> expression, int pageNumber, int pageSize);
        Task<int> countAsync(Expression<Func<Produto, bool>> expression);
        Task<Produto> addAsync(Produto dto);

   
    }
}
