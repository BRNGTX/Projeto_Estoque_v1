using Dominio.Entidades;
using InfraEstrutura.Data;
using Interface;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace InfraEstrutura.Repositorio
{
    public class MovimentacaoRepositorio : IMovimentacaoRepositorio
    {
        private EmpresaContexto contexto;

        public MovimentacaoRepositorio(EmpresaContexto contexto)
        {
            this.contexto = contexto;
        }

        public async Task<MovimentacaoEstoque> addAsync(MovimentacaoEstoque dto)
        {
            await contexto.MovimentacoesEstoque.AddAsync(dto);
            await contexto.SaveChangesAsync();
            return dto;
        }

        public async Task deleteAsync(MovimentacaoEstoque dto)
        {
            contexto.MovimentacoesEstoque.Remove(dto);
            await contexto.SaveChangesAsync();
        }

        public async Task<MovimentacaoEstoque?> getAsync(int id)
        {
            return await contexto.MovimentacoesEstoque
                .Include(m => m.Produto)
                    .ThenInclude(p => p!.Categoria)
                .FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<MovimentacaoEstoque?> getAsync(Expression<Func<MovimentacaoEstoque, bool>> expression)
        {
            return await contexto.MovimentacoesEstoque
                .Include(m => m.Produto)
                    .ThenInclude(p => p!.Categoria)
                .Where(expression)
                .FirstOrDefaultAsync();
        }

        public async Task<List<MovimentacaoEstoque>> listAsync(Expression<Func<MovimentacaoEstoque, bool>> expression)
        {
            return await contexto.MovimentacoesEstoque
                .Include(m => m.Produto)
                    .ThenInclude(p => p!.Categoria)
                .Where(expression)
                .OrderByDescending(m => m.Data)
                .ToListAsync();
        }

        public async Task<List<MovimentacaoEstoque>> listPagedAsync(Expression<Func<MovimentacaoEstoque, bool>> expression, int pageNumber, int pageSize)
        {
            return await contexto.MovimentacoesEstoque
                .Include(m => m.Produto)
                .Where(expression)
                .OrderByDescending(m => m.Data)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> countAsync(Expression<Func<MovimentacaoEstoque, bool>> expression)
        {
            return await contexto.MovimentacoesEstoque.CountAsync(expression);
        }

        public async Task updateAsync(MovimentacaoEstoque dto)
        {
            contexto.Entry<MovimentacaoEstoque>(dto).State = EntityState.Modified;
            await contexto.SaveChangesAsync();
        }
    }
}

