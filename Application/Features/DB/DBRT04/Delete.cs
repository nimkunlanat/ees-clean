using Application.Interfaces;
using MediatR;
using System.Threading.Tasks;
using System.Threading;
using Application.Behaviors;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System;

namespace Application.Features.DB.DBRT04;

public class Delete
{
    public class Command : ICommand
    {
        public Guid ProvinceCode { get; set; }
    }
    public class Handler : IRequestHandler<Command, Unit>
    {
        private readonly ICleanDbContext _context;
        public Handler(ICleanDbContext context) => _context = context;

        public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
        {
            Domain.Entities.DB.Province dbProvince = await _context.Set<Domain.Entities.DB.Province>().Where(w => w.ProvinceCode == request.ProvinceCode).FirstOrDefaultAsync();
            _context.Set<Domain.Entities.DB.Province>().RemoveRange(dbProvince);
            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
