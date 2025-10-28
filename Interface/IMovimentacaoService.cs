using Dominio.Dtos;
using Dominio.Entidades;
using System.Linq.Expressions;

namespace Interface
{
    public interface IMovimentacaoService
    {
        Task<MovimentacaoEstoqueDto> addAsync(MovimentacaoEstoqueDto dto);
        Task<MovimentacaoEstoqueDto?> getAsync(int id);
        Task<List<MovimentacaoEstoqueDto>> listAsync(Expression<Func<MovimentacaoEstoque, bool>> expression);
        Task<PagedResult<MovimentacaoEstoqueDto>> listPagedAsync(Expression<Func<MovimentacaoEstoque, bool>> expression, int pageNumber, int pageSize);
        Task<bool> updateAsync(MovimentacaoEstoqueDto dto);
        Task<bool> deleteAsync(int id);
    }
}


