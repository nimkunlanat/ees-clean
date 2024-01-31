using Application.Interfaces;
using MediatR;
using System.Threading.Tasks;
using System.Threading;
using Application.Behaviors;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System;

namespace Application.Features.DB.DBRT04;

public class DeleteSubdistrict
{
    public class Command : ICommand
    {
        public Guid SubdistrictCode { get; set; }
    }
    public class Handler : IRequestHandler<Command, Unit>
    {
        private readonly ICleanDbContext _context;
        public Handler(ICleanDbContext context) => _context = context;

        public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
        {
            Domain.Entities.DB.Subdistrict dbSubdistrict = await _context.Set<Domain.Entities.DB.Subdistrict>().Where(w => w.SubdistrictCode == request.SubdistrictCode).FirstOrDefaultAsync();
            _context.Set<Domain.Entities.DB.Subdistrict>().RemoveRange(dbSubdistrict);
            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
