using Application.Behaviors;
using Application.Exceptions;
using Application.Interfaces;
using Domain.Entities;
using Domain.Entities.ET;
using Domain.Entities.SU;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.ET.ETRT05;
public class Save
{
    public class Command : EvaluateGroup, ICommand<EvaluateGroup>
    {

    }
    public class Handler : IRequestHandler<Command, EvaluateGroup>
    {
        private readonly ICleanDbContext _context;
        private readonly ICurrentUserAccessor _user;
        public Handler(ICleanDbContext context, ICurrentUserAccessor user)
        {
            _context = context;
            _user = user;
        }

        public async Task<EvaluateGroup> Handle(Command request, CancellationToken cancellationToken)
        {
            Validate(request);

            if (request.EvaluateDetails == null) request.EvaluateDetails = new List<EvaluateDetail>();

            if (request.RowState == RowState.Add)
            {
                _context.Set<EvaluateGroup>().Add(request);
            }
            else if (request.RowState == RowState.Edit)
            {
                _context.Set<EvaluateGroup>().Attach(request);
                _context.Entry(request).State = EntityState.Modified;
            }
            else if (request.RowState == RowState.Delete)
            {
                _context.Set<EvaluateGroup>().Remove(request);
            }
            _context.Set<EvaluateDetail>().RemoveRange(request.EvaluateDetails.Where(w => w.RowState == RowState.Delete));
            _context.Set<EvaluateDetail>().AddRange(request.EvaluateDetails.Where(w => w.RowState == RowState.Add));
            _context.Set<EvaluateDetail>().AttachRange(request.EvaluateDetails.Where(w => w.RowState == RowState.Edit));

            request.EvaluateDetails.Where(w => w.RowState == RowState.Edit).ToList().ForEach(f => _context.Entry(f).State = EntityState.Modified);
            await _context.SaveChangesAsync(cancellationToken);

            return request;
        }

        private void Validate(EvaluateGroup evaluateGroup)
        {
            List<EvaluateDetail> etEvaluateDetails = evaluateGroup.EvaluateDetails.Where(w => w.RowState == RowState.Add).ToList();

            if (_context.Set<EvaluateGroup>().Any(a => evaluateGroup.RowState == RowState.Add && a.EvaluateGroupCode.ToUpper() == evaluateGroup.EvaluateGroupCode.ToUpper())) throw new RestException(HttpStatusCode.BadRequest, "message.STD00018", evaluateGroup.EvaluateGroupCode);
            else if (_context.Set<EvaluateDetail>().Any(a => etEvaluateDetails.Select(s => s.EvaluateDetailCode).Contains(a.EvaluateDetailCode) && a.EvaluateGroupCode == evaluateGroup.EvaluateGroupCode)) throw new RestException(HttpStatusCode.BadRequest, "message.STD00045");
        }
    }
}
