using Application.Behaviors;
using Application.Interfaces;
using Domain.Entities.ET;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.ET.ETRT05;

public class Delete
{
    public class Command : ICommand
    {
        public string EvaluateGroupCode { get; set; }

    }
    public class Handler : IRequestHandler<Command, Unit>
    {
        private readonly ICleanDbContext _context;
        public Handler(ICleanDbContext context) => _context = context;
        public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
        {
            EvaluateGroup evaluationGroup = await _context.Set<EvaluateGroup>().Where(w => w.EvaluateGroupCode == request.EvaluateGroupCode).Include(i => i.EvaluateDetails).FirstOrDefaultAsync();
            _context.Set<EvaluateGroup>().Remove(evaluationGroup);
            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
