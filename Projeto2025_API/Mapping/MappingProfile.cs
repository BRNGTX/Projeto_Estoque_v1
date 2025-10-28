using AutoMapper;
using Dominio.Dtos;
using Dominio.Entidades;

namespace Projeto2025_API.Mapping
{
    public class MappingProfile:Profile
    {
        public MappingProfile() { 
        
            CreateMap<Categoria, CategoriaDto>().ReverseMap();
            CreateMap<Produto, ProdutoDto>().ReverseMap();
            CreateMap<MovimentacaoEstoque, MovimentacaoEstoqueDto>()
                .ForMember(dest => dest.IdProduto, opt => opt.MapFrom(src => src.Produto != null ? src.Produto.Id : src.IdProduto))
                .ReverseMap();
        }
    }
}
