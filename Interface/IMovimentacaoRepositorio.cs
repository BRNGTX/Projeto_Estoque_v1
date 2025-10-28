using Dominio.Entidades;
using System.Linq.Expressions;

namespace Interface
{
    public interface IMovimentacaoRepositorio
    {
        Task<MovimentacaoEstoque> addAsync(MovimentacaoEstoque dto);
        Task<MovimentacaoEstoque?> getAsync(int id);
        Task<MovimentacaoEstoque?> getAsync(Expression<Func<MovimentacaoEstoque, bool>> expression);
        Task<List<MovimentacaoEstoque>> listAsync(Expression<Func<MovimentacaoEstoque, bool>> expression);
        Task<List<MovimentacaoEstoque>> listPagedAsync(Expression<Func<MovimentacaoEstoque, bool>> expression, int pageNumber, int pageSize);
        Task<int> countAsync(Expression<Func<MovimentacaoEstoque, bool>> expression);
        Task updateAsync(MovimentacaoEstoque dto);
        Task deleteAsync(MovimentacaoEstoque dto);
    }
}

