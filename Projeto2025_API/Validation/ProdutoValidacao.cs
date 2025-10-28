using Dominio.Dtos;
using FluentValidation;

namespace Projeto2025_API.Validation
{
    public class ProdutoValidacao:AbstractValidator<ProdutoDto>
    {
        public ProdutoValidacao() {
            RuleFor(p=>p.Descricao).NotEmpty().WithMessage("Descrição não pode ser vazia");
            RuleFor(p => p.Descricao).MaximumLength(150).WithMessage("Descrição no máximo 150");
            RuleFor(p => p.Valor).GreaterThan(0).WithMessage("Valor deve ser maior que zero");
            RuleFor(p => p.Quantidade).GreaterThanOrEqualTo(0).WithMessage("Quantidade não pode ser negativa");
            RuleFor(p => p.IdCategoria).GreaterThan(0).WithMessage("Categoria é obrigatória");
        }
    }
}
