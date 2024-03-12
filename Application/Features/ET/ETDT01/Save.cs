using Application.Behaviors;
using Application.Exceptions;
using Application.Interfaces;
using Domain.Entities;
using Domain.Entities.ET;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;


namespace Application.Features.ET.ETDT01;

public class Save
{
    public class Command : DocumentApproved, ICommand<DocumentApproved>
    {

    }
    public class Handler : IRequestHandler<Command, DocumentApproved>
    {
        private readonly ICleanDbContext _context;
        public Handler(ICleanDbContext context)
        {
            _context = context;
        }

        public async Task<DocumentApproved> Handle(Command request, CancellationToken cancellationToken)
        {
            Validate(request);

            if (request.DocumentApprovedDetails == null) request.DocumentApprovedDetails = new List<DocumentApprovedDetail>();

            if (request.RowState == RowState.Add)
            {
                _context.Set<DocumentApproved>().Add(request);

            }
            else if (request.RowState == RowState.Edit)
            {
                _context.Set<DocumentApproved>().Attach(request);
                _context.Entry(request).State = EntityState.Modified;
            }

            _context.Set<DocumentApprovedDetail>().AddRange(request.DocumentApprovedDetails.Where(w => w.RowState == RowState.Add));
            _context.Set<DocumentApprovedDetail>().AttachRange(request.DocumentApprovedDetails.Where(w => w.RowState == RowState.Edit));

            request.DocumentApprovedDetails.Where(w => w.RowState == RowState.Edit).ToList().ForEach(f => _context.Entry(f).State = EntityState.Modified);
            await _context.SaveChangesAsync(cancellationToken);

            return request;
        }
        private void Validate(DocumentApproved document)
        {
            if (_context.Set<DocumentApproved>().Any(a => document.RowState == RowState.Add && a.DocumentNo == document.DocumentNo)) throw new RestException(HttpStatusCode.BadRequest, "message.STD00004");
        }
    }
}
