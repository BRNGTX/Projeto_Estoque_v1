using Dominio.Dtos;
using FluentValidation;

namespace Projeto2025_API.Validation
{
    public class CategoriaValidacao:AbstractValidator<CategoriaDto>
    {
        public CategoriaValidacao() {
            RuleFor(p=>p.Descricao).NotEmpty().WithMessage("Descrição não pode ser vazia");
            RuleFor(p => p.Descricao).MaximumLength(150).WithMessage("Descrição no máximo 150");
            RuleFor(p => p.DescricaoDetalhada).NotEmpty().WithMessage("Descrição detalhada é obrigatória");
            RuleFor(p => p.DescricaoDetalhada).MaximumLength(500).WithMessage("Descrição detalhada no máximo 500 caracteres");
        }
    }
}
