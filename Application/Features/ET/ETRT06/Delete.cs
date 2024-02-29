using Application.Behaviors;
using Application.Interfaces;
using Domain.Entities.ET;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.ET.ETRT06;

public class Delete
{
    public class Command : ICommand
    {
        public string GroupName { get; set; }

    }
    public class Handler : IRequestHandler<Command, Unit>
    {
        private readonly ICleanDbContext _context;
        public Handler(ICleanDbContext context) => _context = context;
        public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
        {
            SkillMatrixGroup skillMatrixGroup = await _context.Set<SkillMatrixGroup>().Where(w => w.GroupName == request.GroupName).FirstOrDefaultAsync();
            _context.Set<SkillMatrixGroup>().RemoveRange(skillMatrixGroup);
            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
