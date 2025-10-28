using AutoMapper;
using Dominio.Dtos;
using Dominio.Entidades;
using Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Service
{
    public class CategoriaService: ICategoriaService
    {
        private ICategoriaRepositorio repositorio;
        private IMapper mapper;

        public CategoriaService(ICategoriaRepositorio repositorio, IMapper mapper)
        {
            this.repositorio = repositorio;
            this.mapper = mapper;
        }

        public async Task<CategoriaDto> addAsync(CategoriaDto dto)
        {
            var cat = mapper.Map<Categoria>(dto);
            cat = await repositorio.addAsync(cat);
            
            return mapper.Map<CategoriaDto>(cat);
        }

        public async Task<bool> deleteAsync(int id)
        {
            var cat = await repositorio.getAsync(id);
            if (cat != null)
            {
                await repositorio.deleteAsync(cat);
                return true;
            }
            else return false;
        }

        public async Task<CategoriaDto?> getAsync(int id)
        {
            return mapper.Map<CategoriaDto>(await repositorio.getAsync(id));
        }

        public async Task<CategoriaDto?> getAsync(Expression<Func<Categoria, bool>> expression)
        {

            return mapper.Map<CategoriaDto>(await repositorio.getAsync(expression));
        }

        public async Task<List<CategoriaDto>> listAsync(Expression<Func<Categoria, bool>> expression)
        {

            return mapper.Map<List<CategoriaDto>>( await  repositorio.listAsync(expression));
        }

        public async Task<PagedResult<CategoriaDto>> listPagedAsync(Expression<Func<Categoria, bool>> expression, int pageNumber, int pageSize)
        {
            var totalCount = await repositorio.countAsync(expression);
            var items = await repositorio.listPagedAsync(expression, pageNumber, pageSize);
            
            return new PagedResult<CategoriaDto>
            {
                Items = mapper.Map<List<CategoriaDto>>(items),
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }

        

        public async Task<bool> updateAsync(CategoriaDto dto)
        {
            var cat = mapper.Map<Categoria>(dto);
            await repositorio.updateAsync(cat);
            
            return true;
        }
    }
}
