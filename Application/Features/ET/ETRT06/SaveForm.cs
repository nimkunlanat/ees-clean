using Application.Behaviors;
using Application.Exceptions;
using Application.Interfaces;
using Domain.Entities;
using Domain.Entities.ET;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data.SqlTypes;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.ET.ETRT06;
public class SaveForm
{
    public class Command : SkillMatrixGroup, ICommand<SkillMatrixGroup>
    {

    }
    public class Handler : IRequestHandler<Command, SkillMatrixGroup>
    {
        private readonly ICleanDbContext _context;
        private readonly ICurrentUserAccessor _user;
        public Handler(ICleanDbContext context, ICurrentUserAccessor user)
        {
            _context = context;
            _user = user;
        }

        public async Task<SkillMatrixGroup> Handle(Command request, CancellationToken cancellationToken)
        {
            Validate(request);

            if (request.SkillMatrixSubjects == null) request.SkillMatrixSubjects = new List<SkillMatrixSubject>();

            if (request.RowState == RowState.Add)
            {
                _context.Set<SkillMatrixGroup>().Add(request);
            }
            else if (request.RowState == RowState.Edit)
            {
                _context.Set<SkillMatrixSubject>().RemoveRange(request.SkillMatrixSubjects.Where(w => w.RowState == RowState.Delete));
                _context.Set<SkillMatrixSubject>().AddRange(request.SkillMatrixSubjects.Where(w => w.RowState == RowState.Add));
                _context.Set<SkillMatrixSubject>().AttachRange(request.SkillMatrixSubjects.Where(w => w.RowState == RowState.Edit));
                request.SkillMatrixSubjects.Where(w => w.RowState == RowState.Edit).ToList().ForEach(f => _context.Entry(f).State = EntityState.Modified);
                
                _context.Set<SkillMatrixGroup>().Attach(request);
                _context.Entry(request).State = EntityState.Modified;
                
            }
            else if (request.RowState == RowState.Delete)
            {
                _context.Set<SkillMatrixGroup>().Remove(request);
            }
            await _context.SaveChangesAsync(cancellationToken);

            return request;
        }
        private void Validate(SkillMatrixGroup skillMatrixGroup)
        {
            if (_context.Set<SkillMatrixGroup>().Any(a => skillMatrixGroup.RowState == RowState.Add && a.GroupId == skillMatrixGroup.GroupId)) throw new RestException(HttpStatusCode.BadRequest, "message.STD00018");
        }
    }
}
