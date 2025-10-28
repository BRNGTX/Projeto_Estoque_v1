using AutoMapper;
using Dominio.Dtos;
using Dominio.Entidades;
using Interface;
using System.Linq.Expressions;

namespace Service
{
    public class MovimentacaoService : IMovimentacaoService
    {
        private IMovimentacaoRepositorio repositorio;
        private IProdutoRepositorio produtoRepositorio;
        private IMapper mapper;

        public MovimentacaoService(
            IMovimentacaoRepositorio repositorio, 
            IProdutoRepositorio produtoRepositorio,
            IMapper mapper)
        {
            this.repositorio = repositorio;
            this.produtoRepositorio = produtoRepositorio;
            this.mapper = mapper;
        }

        public async Task<MovimentacaoEstoqueDto> addAsync(MovimentacaoEstoqueDto dto)
        {
            var movimentacao = mapper.Map<MovimentacaoEstoque>(dto);
            movimentacao.Data = DateTime.Now;

            // Atualizar quantidade do produto
            var produto = await produtoRepositorio.getAsync(dto.IdProduto);
            if (produto == null)
                throw new Exception("Produto não encontrado");

            if (dto.Tipo == "Entrada")
            {
                produto.Quantidade += dto.Quantidade;
            }
            else if (dto.Tipo == "Saída")
            {
                if (produto.Quantidade < dto.Quantidade)
                    throw new Exception("Estoque insuficiente");
                produto.Quantidade -= dto.Quantidade;
            }

            await produtoRepositorio.updateAsync(produto);
            var movimentacaoAdicionada = await repositorio.addAsync(movimentacao);

            return mapper.Map<MovimentacaoEstoqueDto>(movimentacaoAdicionada);
        }

        public async Task<bool> deleteAsync(int id)
        {
            var mov = await repositorio.getAsync(id);
            if (mov == null)
                return false;

            // Reverter movimentação
            var produto = await produtoRepositorio.getAsync(mov.IdProduto);
            if (produto != null)
            {
                if (mov.Tipo == "Entrada")
                {
                    produto.Quantidade -= mov.Quantidade;
                }
                else if (mov.Tipo == "Saída")
                {
                    produto.Quantidade += mov.Quantidade;
                }
                await produtoRepositorio.updateAsync(produto);
            }

            await repositorio.deleteAsync(mov);
            return true;
        }

        public async Task<MovimentacaoEstoqueDto?> getAsync(int id)
        {
            var mov = await repositorio.getAsync(id);
            if (mov == null) return null;
            return mapper.Map<MovimentacaoEstoqueDto>(mov);
        }

        public async Task<List<MovimentacaoEstoqueDto>> listAsync(Expression<Func<MovimentacaoEstoque, bool>> expression)
        {
            var list = await repositorio.listAsync(expression);
            return mapper.Map<List<MovimentacaoEstoqueDto>>(list);
        }

        public async Task<PagedResult<MovimentacaoEstoqueDto>> listPagedAsync(Expression<Func<MovimentacaoEstoque, bool>> expression, int pageNumber, int pageSize)
        {
            var count = await repositorio.countAsync(expression);
            var list = await repositorio.listPagedAsync(expression, pageNumber, pageSize);

            return new PagedResult<MovimentacaoEstoqueDto>
            {
                Items = mapper.Map<List<MovimentacaoEstoqueDto>>(list),
                TotalCount = count,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }

        public async Task<bool> updateAsync(MovimentacaoEstoqueDto dto)
        {
            var mov = await repositorio.getAsync(dto.Id);
            if (mov == null)
                return false;

            // Reverter movimentação antiga
            var produto = await produtoRepositorio.getAsync(mov.IdProduto);
            if (produto != null)
            {
                if (mov.Tipo == "Entrada")
                {
                    produto.Quantidade -= mov.Quantidade;
                }
                else if (mov.Tipo == "Saída")
                {
                    produto.Quantidade += mov.Quantidade;
                }
            }

            // Aplicar nova movimentação
            var novoProduto = await produtoRepositorio.getAsync(dto.IdProduto);
            if (novoProduto == null)
                return false;

            if (dto.Tipo == "Entrada")
            {
                novoProduto.Quantidade += dto.Quantidade;
            }
            else if (dto.Tipo == "Saída")
            {
                if (novoProduto.Quantidade < dto.Quantidade)
                    throw new Exception("Estoque insuficiente");
                novoProduto.Quantidade -= dto.Quantidade;
            }

            await produtoRepositorio.updateAsync(novoProduto);

            mov.Tipo = dto.Tipo;
            mov.IdProduto = dto.IdProduto;
            mov.Quantidade = dto.Quantidade;
            mov.Observacao = dto.Observacao;

            await repositorio.updateAsync(mov);
            return true;
        }
    }
}

