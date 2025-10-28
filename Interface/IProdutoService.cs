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
    public   interface IProdutoService
    {
        Task<bool> deleteAsync(int id);
        Task<bool> updateAsync(ProdutoDto dto);
    
        Task<ProdutoDto?> getAsync(int id);
        Task<ProdutoDto?> getAsync(Expression<Func<Produto, bool>> expression);
        Task<List<ProdutoDto>> listAsync(Expression<Func<Produto, bool>> expression);
        Task<PagedResult<ProdutoDto>> listPagedAsync(Expression<Func<Produto, bool>> expression, int pageNumber, int pageSize);
        Task<ProdutoDto> addAsync(ProdutoDto dto);


    }
}
