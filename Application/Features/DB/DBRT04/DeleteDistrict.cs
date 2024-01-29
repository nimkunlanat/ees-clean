using Application.Interfaces;
using MediatR;
using System.Threading.Tasks;
using System.Threading;
using Application.Behaviors;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System;

namespace Application.Features.DB.DBRT04;

public class DeleteDistrict
{
    public class Command : ICommand
    {
        public Guid DistrictCode { get; set; }
    }
    public class Handler : IRequestHandler<Command, Unit>
    {
        private readonly ICleanDbContext _context;
        public Handler(ICleanDbContext context) => _context = context;

        public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
        {
            Domain.Entities.DB.District dbDistrict = await _context.Set<Domain.Entities.DB.District>().Where(w => w.DistrictCode == request.DistrictCode).FirstOrDefaultAsync();
            _context.Set<Domain.Entities.DB.District>().RemoveRange(dbDistrict);
            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
