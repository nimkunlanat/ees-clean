using Application.Behaviors;
using Application.Interfaces;
using Domain.Entities.DB;
using Domain.Entities.ET;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.ET.ETDT01;

public class Delete
{
    public class Command : ICommand
    {
        public Guid documentNo { get; set; }
    }
    public class Handler : IRequestHandler<Command, Unit>
    {
        private readonly ICleanDbContext _context;
        public Handler(ICleanDbContext context) => _context = context;

        public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
        {
            DocumentApproved etddocumentApprovedDetails = await _context.Set<DocumentApproved>().Where(w => w.DocumentNo == request.documentNo).Include(i => i.DocumentApprovedDetails).FirstOrDefaultAsync();
            DocumentApproved etdocumentApprovedSkills = await _context.Set<DocumentApproved>().Where(w => w.DocumentNo == request.documentNo).Include(i => i.DocumentApprovedSkills).FirstOrDefaultAsync();
            _context.Set<DocumentApproved>().RemoveRange(etddocumentApprovedDetails);
            _context.Set<DocumentApproved>().RemoveRange(etdocumentApprovedSkills);
            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
