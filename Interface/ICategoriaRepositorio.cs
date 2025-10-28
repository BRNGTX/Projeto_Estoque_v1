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
    public interface ICategoriaRepositorio
    {
        Task updateAsync(Categoria dto);

        Task deleteAsync(Categoria dto);
        Task<Categoria?> getAsync(int id);
        Task<Categoria?> getAsync(Expression<Func<Categoria, bool>> expression);
        Task<List<Categoria>> listAsync(Expression<Func<Categoria, bool>> expression);
        Task<List<Categoria>> listPagedAsync(Expression<Func<Categoria, bool>> expression, int pageNumber, int pageSize);
        Task<int> countAsync(Expression<Func<Categoria, bool>> expression);
        Task<Categoria> addAsync(Categoria dto);

   
    }
}
