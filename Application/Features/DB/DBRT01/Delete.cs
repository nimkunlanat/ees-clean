using Application.Interfaces;
using MediatR;
using System.Threading.Tasks;
using System.Threading;
using Application.Behaviors;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System;

namespace Application.Features.DB.DBRT01;

public class Delete
{
    public class Command : ICommand
    {
        public Guid Id { get; set; }
    }
    public class Handler : IRequestHandler<Command, Unit>
    {
        private readonly ICleanDbContext _context;
        public Handler(ICleanDbContext context) => _context = context;

        public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
        {
            Domain.Entities.DB.Status dbStatus = await _context.Set<Domain.Entities.DB.Status>().Where(w => w.Id == request.Id).FirstOrDefaultAsync();
            _context.Set<Domain.Entities.DB.Status>().RemoveRange(dbStatus);
            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
