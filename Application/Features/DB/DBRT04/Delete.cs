using Application.Interfaces;
using MediatR;
using System.Threading.Tasks;
using System.Threading;
using Application.Behaviors;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System;
using Domain.Entities.DB;
using System.Collections.Generic;

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
            Province dbProvince = await _context.Set<Province>().Where(w => w.ProvinceCode == request.ProvinceCode).Include(i => i.Districts).FirstOrDefaultAsync();
            List<District> dbDistict = await _context.Set<District>().Where(w => w.ProvinceCode == request.ProvinceCode).Include(i => i.Subdistrict).ToListAsync();
            _context.Set<Province>().Remove(dbProvince);
            _context.Set<District>().RemoveRange(dbDistict);
            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
