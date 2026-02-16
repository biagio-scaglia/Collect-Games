using CollectGames.Backend.Dtos;
using CollectGames.Backend.Models;
using FluentValidation;

namespace CollectGames.Backend.Validators
{
    public class UserCollectionCreateValidator : AbstractValidator<UserCollectionCreateDto>
    {
        public UserCollectionCreateValidator()
        {
            RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
            RuleFor(x => x.Platform).NotEmpty().MaximumLength(50);
            RuleFor(x => x.Condition).NotEmpty();
            RuleFor(x => x.PricePaid).GreaterThanOrEqualTo(0).When(x => x.PricePaid.HasValue);
        }
    }
}
