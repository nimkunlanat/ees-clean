using Application.Behaviors;
using Application.Interfaces;
using Domain.Entities.DB;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.DB.DBRT03;
public class Delete
{
    public class Command : ICommand
    {
        public string PositionCode { get; set; }

    }

    public class Handler : IRequestHandler<Command, Unit>
    {
        private readonly ICleanDbContext _context;
        public Handler(ICleanDbContext context) => _context = context;
        public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
        {
            Position position = await _context.Set<Position>().Where(w => w.PositionCode == request.PositionCode).FirstOrDefaultAsync();
            _context.Set<Position>().RemoveRange(position);
            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
