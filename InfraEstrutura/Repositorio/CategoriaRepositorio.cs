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
    public class CategoriaRepositorio : ICategoriaRepositorio

    {
        private EmpresaContexto contexto;

        public CategoriaRepositorio(EmpresaContexto contexto) {
            this.contexto = contexto;
        }

        public async Task<Categoria> addAsync(Categoria dto)
        {
            await contexto.Categorias.AddAsync(dto);
            await contexto.SaveChangesAsync();
            return dto;
        }

        public async Task deleteAsync(Categoria dto)
        {
             contexto.Categorias.Remove(dto);
            await contexto.SaveChangesAsync();
        }

        public async Task<Categoria?> getAsync(int id)
        {
            return await contexto.Categorias.FindAsync(id);
        }

        public async Task<Categoria?> getAsync(Expression<Func<Categoria, bool>> expression)
        {
            return await contexto.Categorias.Where(expression).FirstOrDefaultAsync();
        }

        public async Task<List<Categoria>> listAsync(Expression<Func<Categoria, bool>> expression)
        {
            return await contexto.Categorias.Where(expression).ToListAsync();
        }

        public async Task<List<Categoria>> listPagedAsync(Expression<Func<Categoria, bool>> expression, int pageNumber, int pageSize)
        {
            return await contexto.Categorias
                .Where(expression)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> countAsync(Expression<Func<Categoria, bool>> expression)
        {
            return await contexto.Categorias.CountAsync(expression);
        }

       

        public async Task updateAsync(Categoria dto)
        {
             contexto.Entry<Categoria>(dto).State = EntityState.Modified;
            await contexto.SaveChangesAsync();
        }
    }
}
