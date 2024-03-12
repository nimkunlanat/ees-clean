using Application.Interfaces;
using Domain.Entities.ET;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.ET.ETRT06;

public class Grade
{
    public class Query : IRequest<SkillMatrixSubject>
    {
        public Guid SubjectId { get; set; }
    }
    public class Handler : IRequestHandler<Query, SkillMatrixSubject>
    {
        private readonly ICleanDbContext _context;
        public Handler(ICleanDbContext context) => _context = context;
        public async Task<SkillMatrixSubject> Handle(Query request, CancellationToken cancellationToken)
        {
            StringBuilder sql = new StringBuilder();
            SkillMatrixSubject skillMatrixSubject = new();

            sql.AppendLine(@"select sms.subject_id ""subjectId""
                                    , sms.subject_group ""subjectGroup""
                                    , sms.subject_name ""subjectName""
                                    ,sms.group_id ""groupId""
                                    , sms.active ""active""
                                    , sms.xmin ""rowVersion""
                                    from et.skill_matrix_subject sms 
                                    where sms.subject_id = @subjectId");

            skillMatrixSubject = await _context.QueryFirstOrDefaultAsync<SkillMatrixSubject>(sql.ToString(), new { subjectId = request.SubjectId }, cancellationToken);

            if (skillMatrixSubject != null)
            {
                sql = new StringBuilder();
                sql.AppendLine(@"select smg.subject_id ""subjectId""
                                , smg.grade_id ""gradeId""
                                , smg.grade ""grade""
                                , smg.description ""description""
                                , smg.score ""score""
                                , smg.expected_score ""expectedScore""
                                , smg.example ""example""
                                , smg.active ""active""
                                , smg.xmin ""rowVesion""
                                from et.skill_matrix_grade smg 
                                where smg.subject_id = @subjectId");

                skillMatrixSubject.SkillMatrixGrades = await _context.QueryAsync<SkillMatrixGrade>(sql.ToString(), new { subjectId = request.SubjectId }, cancellationToken) as List<SkillMatrixGrade>;
            }

            return skillMatrixSubject;
        }
    }
}
