using Application.Behaviors;
using Application.Exceptions;
using Application.Interfaces;
using Domain.Entities;
using Domain.Entities.ET;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.ET.ETRT06;

public class SaveGrade
{
    public class Command : SkillMatrixSubject, ICommand<SkillMatrixSubject>
    {

    }
    public class Handler : IRequestHandler<Command, SkillMatrixSubject>
    {
        private readonly ICleanDbContext _context;
        private readonly ICurrentUserAccessor _user;
        public Handler(ICleanDbContext context, ICurrentUserAccessor user)
        {
            _context = context;
            _user = user;
        }

        public async Task<SkillMatrixSubject> Handle(Command request, CancellationToken cancellationToken)
        {
            Validate(request);

            if (request.SkillMatrixGrades == null) request.SkillMatrixGrades = new List<SkillMatrixGrade>();

            if (request.RowState == RowState.Add)
            {
                _context.Set<SkillMatrixSubject>().Add(request);
            }
            else if (request.RowState == RowState.Edit)
            {
                SkillMatrixSubject skillMatrixSubject = await _context.Set<SkillMatrixSubject>().Where(w => w.SubjectId == request.SubjectId).FirstOrDefaultAsync();
                SkillMatrixSubject skillMatrixSubjectResult = skillMatrixSubject;
                skillMatrixSubjectResult.SubjectName = request.SubjectName;
                skillMatrixSubjectResult.Description = request.Description;
                _context.Set<SkillMatrixSubject>().Attach(skillMatrixSubjectResult);
                _context.Entry(skillMatrixSubjectResult).State = EntityState.Modified;
            }
            else if (request.RowState == RowState.Delete)
            {
                _context.Set<SkillMatrixSubject>().Remove(request);
            }
            _context.Set<SkillMatrixGrade>().RemoveRange(request.SkillMatrixGrades.Where(w => w.RowState == RowState.Delete));
            _context.Set<SkillMatrixGrade>().AddRange(request.SkillMatrixGrades.Where(w => w.RowState == RowState.Add));
            _context.Set<SkillMatrixGrade>().AttachRange(request.SkillMatrixGrades.Where(w => w.RowState == RowState.Edit));

            request.SkillMatrixGrades.Where(w => w.RowState == RowState.Edit).ToList().ForEach(f => _context.Entry(f).State = EntityState.Modified);
            try
            {
                await _context.SaveChangesAsync(cancellationToken);
            }
            catch (Exception ex)
            {

            }

            return request;
        }

        private void Validate(SkillMatrixSubject skillMatrixSubject)
        {
            List<SkillMatrixGrade> etSkillMatrixGrades = skillMatrixSubject.SkillMatrixGrades.Where(w => w.RowState == RowState.Add).ToList();

            if (_context.Set<SkillMatrixSubject>().Any(a => skillMatrixSubject.RowState == RowState.Add)) throw new RestException(HttpStatusCode.BadRequest, "message.STD00018", skillMatrixSubject.SubjectName);
        }
    }
}
