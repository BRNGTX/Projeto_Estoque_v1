using Dominio.Entidades;
using InfraEstrutura.Data;
using Interface;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace InfraEstrutura.Repositorio
{
    public class ProdutoRepositorio : IProdutoRepositorio

    {
        private EmpresaContexto contexto;

        public ProdutoRepositorio(EmpresaContexto contexto) {
            this.contexto = contexto;
        }

        public async Task<Produto> addAsync(Produto dto)
        {
            await contexto.Produtos.AddAsync(dto);
            await contexto.SaveChangesAsync();
            return dto;
        }

        public async Task deleteAsync(Produto dto)
        {
             contexto.Produtos.Remove(dto);
            await contexto.SaveChangesAsync();
        }

        public async Task<Produto?> getAsync(int id)
        {
            return await contexto.Produtos
                .Include(p => p.Categoria)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Produto?> getAsync(Expression<Func<Produto, bool>> expression)
        {
            return await contexto.Produtos
                .Include(p => p.Categoria)
                .Where(expression)
                .FirstOrDefaultAsync();
        }

        public async Task<List<Produto>> listAsync(Expression<Func<Produto, bool>> expression)
        {
            return await contexto.Produtos
                .Include(p => p.Categoria)
                .Where(expression)
                .ToListAsync();
        }

        public async Task<List<Produto>> listPagedAsync(Expression<Func<Produto, bool>> expression, int pageNumber, int pageSize)
        {
            return await contexto.Produtos
                .Include(p => p.Categoria)
                .Where(expression)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> countAsync(Expression<Func<Produto, bool>> expression)
        {
            return await contexto.Produtos.CountAsync(expression);
        }

       

        public async Task updateAsync(Produto dto)
        {
             contexto.Entry<Produto>(dto).State = EntityState.Modified;
            await contexto.SaveChangesAsync();
        }
    }
}
