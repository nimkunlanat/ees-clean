using Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Threading;
using static Application.Features.ET.ETDT01.ListAssessment;

namespace Application.Features.ET.ETDT01;

public class ListSkillmatrix
{
    public class Query : IRequest<SkillmatrixDTO>
    {

    }
    public class SkillmatrixDTO
    {
        public List<Skill> Skills { get; set; } = new List<Skill>();
        public List<SkillDetail> SkillDetails { get; set; } = new List<SkillDetail>();
        public List<Status> Status { get; set; } = new List<Status>();
    }
    public class Skill
    {
        public Guid? GroupId { get; set; }
        public Guid? SubjectId { get; set; }
        public string SubjectGroup { get; set; }
        public string SubjectName { get; set; }
        public string ExpectedGrade { get; set; }
        public string FormSkill { get; set; }
    }
    public class SkillDetail
    {
        public Guid? SubjectId { get; }
        public Guid? GradeId { get; }
        public string Description { get; set; }
        public string Score { get; set; }
        public string FormSkill { get; set; }
    }
    public class Status
    {
        public string value { get; set; }
        public string label { get; set; }
        public string seq { get; set; }
    }
    public class Handler : IRequestHandler<Query, SkillmatrixDTO>
    {
        private readonly ICleanDbContext _context;
        private readonly ICurrentUserAccessor _user;

        public Handler(ICleanDbContext context, ICurrentUserAccessor user)
        {
            _context = context;
            _user = user;
        }

        public async Task<SkillmatrixDTO> Handle(Query request, CancellationToken cancellationToken)
        {
            StringBuilder sql = new StringBuilder();
            SkillmatrixDTO result = new();

            sql.AppendLine(@"select sms.group_id ""GroupId""
                                        ,sms.subject_id ""SubjectId""
                                        ,sms.subject_group ""SubjectGroup""
                                        ,sms.subject_name ""SubjectName""
                                        ,sms.expected_grade ""ExpectedGrade""
                                        ,e.form_skill ""FormSkill""
                                        ,sms.xmin ""rowVersion""
                                        from et.skill_matrix_subject sms
                                        inner join et.skill_matrix_group smg on smg.group_id = sms.group_id
                                        inner join db.employee e on e.form_skill  = smg.group_name 
                                        where e.user_id = @userId 
                                        order by sms.subject_group asc ");
            result.Skills = (List<Skill>)await _context.QueryAsync<Skill>(sql.ToString(), new
            { userId = _user.UserId}, cancellationToken);

            sql = new StringBuilder();
            sql.AppendLine(@"select smsg.subject_id ""SubjectId""
                                        ,smsg.grade_id ""GradeId""
                                        ,CONCAT(smsg.grade,'. ',smsg.description ) ""Description""
                                        ,smsg.score ""Score""
                                        ,e.form_skill ""FormSkill""
                                        ,sms.xmin ""rowVersion""
                                        from et.skill_matrix_grade smsg 
                                        inner join et.skill_matrix_subject sms on sms.subject_id = smsg.subject_id 
                                        inner join et.skill_matrix_group smg on smg.group_id = sms.group_id
                                        inner join db.employee e on e.form_skill  = smg.group_name 
                                        where e.user_id = @user_id
                                        order by sms.subject_group , smsg.grade asc ");
            result.SkillDetails = (List<SkillDetail>)await _context.QueryAsync<SkillDetail>(sql.ToString(), new
            { userId = _user.UserId}, cancellationToken);

            sql = new StringBuilder();
            sql.AppendLine(@"select code as value
                                    ,case when :Lang = 'th' then s.desc_th else s.desc_en end as label
                                    ,s.seq
                                    from db.status s 
                                    where table_name = 'ETDT01'
                                    order by s.seq;");
            result.Status = (List<Status>)await _context.QueryAsync<Status>(sql.ToString(), new
            { Lang = _user.Language }, cancellationToken);

            return result;
        }
    }
}
