using Application.Behaviors;
using Application.Interfaces;
using Domain.Entities.ET;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.ET.ETRT05;

public class DeleteForm
{
    public class Command : ICommand
    {
        public string RoleCode { get; set; }

    }
    public class Handler : IRequestHandler<Command, Unit>
    {
        private readonly ICleanDbContext _context;
        public Handler(ICleanDbContext context) => _context = context;
        public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
        {
            EvaluateForm evaluateForm = await _context.Set<EvaluateForm>().Where(w => w.RoleCode == request.RoleCode).Include(i => i.EvaluateGroups).FirstOrDefaultAsync();
            _context.Set<EvaluateForm>().Remove(evaluateForm);
            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
