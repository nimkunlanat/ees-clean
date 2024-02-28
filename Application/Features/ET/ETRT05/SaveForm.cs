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
using System.Threading.Tasks;
using System.Threading;

namespace Application.Features.ET.ETRT05;

public class SaveForm
{
    public class Command : EvaluateForm, ICommand<EvaluateForm>
    {

    }
    public class Handler : IRequestHandler<Command, EvaluateForm>
    {
        private readonly ICleanDbContext _context;
        private readonly ICurrentUserAccessor _user;
        public Handler(ICleanDbContext context, ICurrentUserAccessor user)
        {
            _context = context;
            _user = user;
        }

        public async Task<EvaluateForm> Handle(Command request, CancellationToken cancellationToken)
        {
            Validate(request);

            if (request.EvaluateGroups == null) request.EvaluateGroups = new List<EvaluateGroup>();

            if (request.RowState == RowState.Add)
            {
                _context.Set<EvaluateForm>().Add(request);
            }
            else if (request.RowState == RowState.Edit)
            {
                _context.Set<EvaluateForm>().Attach(request);
                _context.Entry(request).State = EntityState.Modified;
            }
            else if (request.RowState == RowState.Delete)
            {
                _context.Set<EvaluateForm>().Remove(request);
            }
            _context.Set<EvaluateGroup>().RemoveRange(request.EvaluateGroups.Where(w => w.RowState == RowState.Delete));
            _context.Set<EvaluateGroup>().AddRange(request.EvaluateGroups.Where(w => w.RowState == RowState.Add));
            _context.Set<EvaluateGroup>().AttachRange(request.EvaluateGroups.Where(w => w.RowState == RowState.Edit));
                                       
            request.EvaluateGroups.Where(w => w.RowState == RowState.Edit).ToList().ForEach(f => _context.Entry(f).State = EntityState.Modified);
            await _context.SaveChangesAsync(cancellationToken);

            return request;
        }

        private void Validate(EvaluateForm evaluateForm)
        {
            List<EvaluateGroup> etEvaluateGroups = new List<EvaluateGroup>();
            if (evaluateForm.EvaluateGroups != null) etEvaluateGroups = evaluateForm.EvaluateGroups.Where(w => w.RowState == RowState.Add).ToList();
            if (_context.Set<EvaluateForm>().Any(a => evaluateForm.RowState == RowState.Add && a.RoleCode.ToUpper() == evaluateForm.RoleCode.ToUpper())) throw new RestException(HttpStatusCode.BadRequest, "message.STD00018", evaluateForm.RoleCode);
            else if (_context.Set<EvaluateGroup>().Any(a => etEvaluateGroups.Select(s => s.EvaluateGroupCode).Contains(a.EvaluateGroupCode) && a.RoleCode == evaluateForm.RoleCode)) throw new RestException(HttpStatusCode.BadRequest, "message.STD00045");
        }
    }
}
