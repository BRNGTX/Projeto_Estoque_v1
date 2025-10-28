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
    public class ProdutoService: IProdutoService
    {
        private IProdutoRepositorio repositorio;
        private IMapper mapper;

        public ProdutoService(IProdutoRepositorio repositorio, IMapper mapper)
        {
            this.repositorio = repositorio;
            this.mapper = mapper;
        }

        public async Task<ProdutoDto> addAsync(ProdutoDto dto)
        {
            var cat = mapper.Map<Produto>(dto);
            cat = await repositorio.addAsync(cat);
            
            return mapper.Map<ProdutoDto>(cat);
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

        public async Task<ProdutoDto?> getAsync(int id)
        {
            return mapper.Map<ProdutoDto>(await repositorio.getAsync(id));
        }

        public async Task<ProdutoDto?> getAsync(Expression<Func<Produto, bool>> expression)
        {

            return mapper.Map<ProdutoDto>(await repositorio.getAsync(expression));
        }

        public async Task<List<ProdutoDto>> listAsync(Expression<Func<Produto, bool>> expression)
        {

            return mapper.Map<List<ProdutoDto>>( await  repositorio.listAsync(expression));
        }

        public async Task<PagedResult<ProdutoDto>> listPagedAsync(Expression<Func<Produto, bool>> expression, int pageNumber, int pageSize)
        {
            var totalCount = await repositorio.countAsync(expression);
            var items = await repositorio.listPagedAsync(expression, pageNumber, pageSize);
            
            return new PagedResult<ProdutoDto>
            {
                Items = mapper.Map<List<ProdutoDto>>(items),
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }

        

        public async Task<bool> updateAsync(ProdutoDto dto)
        {
            var cat = mapper.Map<Produto>(dto);
            await repositorio.updateAsync(cat);
            
            return true;
        }
    }
}
