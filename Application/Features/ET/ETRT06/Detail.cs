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
public class Detail
{
    public class Query : IRequest<SkillMatrixGroup>
    {
        public Guid GroupId { get; set; }
    }
    public class Handler : IRequestHandler<Query, SkillMatrixGroup>
    {
        private readonly ICleanDbContext _context;
        public Handler(ICleanDbContext context) => _context = context;
        public async Task<SkillMatrixGroup> Handle(Query request, CancellationToken cancellationToken)
        {
            StringBuilder sql = new StringBuilder();
            SkillMatrixGroup skillMatrixGroup = new();

            sql.AppendLine(@"select 
                             smg.group_id ""groupId"",
                             smg.group_name ""groupName""
                             , smg.description ""description""
                             , smg.active ""active""
                             , smg.xmin ""rowVersion""
                             from et.skill_matrix_group smg
                             where smg.group_id = @groupId");

            skillMatrixGroup = await _context.QueryFirstOrDefaultAsync<SkillMatrixGroup>(sql.ToString(), new { groupId = request.GroupId }, cancellationToken);

            if (skillMatrixGroup != null)
            {
                sql = new StringBuilder();
                sql.AppendLine(@"select 
                                 smg.group_id ""groupId"",
                                 sms.subject_id ""subjectId"",
                                 sms.subject_group ""subjectGroup""
                                 , sms.subject_name ""subjectName""
                                 , sms.description ""description""
                                 , sms.active ""active""
                                 , sms.xmin ""rowVersion""
                                 from et.skill_matrix_subject sms 
                                 left join et.skill_matrix_group smg on sms.group_id = smg.group_id
                                 where smg.group_id = @groupId");

                skillMatrixGroup.SkillMatrixSubjects = await _context.QueryAsync<SkillMatrixSubject>(sql.ToString(), new { groupId = request.GroupId}, cancellationToken) as List<SkillMatrixSubject>;
            }

            return skillMatrixGroup;
        }
    }
}
