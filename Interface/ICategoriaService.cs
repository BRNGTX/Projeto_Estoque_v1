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
    public   interface ICategoriaService
    {
        Task<bool> deleteAsync(int id);
        Task<bool> updateAsync(CategoriaDto dto);
    
        Task<CategoriaDto?> getAsync(int id);
        Task<CategoriaDto?> getAsync(Expression<Func<Categoria, bool>> expression);
        Task<List<CategoriaDto>> listAsync(Expression<Func<Categoria, bool>> expression);
        Task<PagedResult<CategoriaDto>> listPagedAsync(Expression<Func<Categoria, bool>> expression, int pageNumber, int pageSize);
        Task<CategoriaDto> addAsync(CategoriaDto dto);


    }
}
