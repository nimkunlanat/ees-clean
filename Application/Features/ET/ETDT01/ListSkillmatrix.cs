using Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Threading;
using static Application.Features.ET.ETDT01.ListAssessment;
using Domain.Entities.ET;
using Domain.Entities;

namespace Application.Features.ET.ETDT01;

public class ListSkillmatrix
{
    public class Query : IRequest<SkillmatrixDTO>
    {
        public Guid? documentNo { get; set; }
    }
    public class SkillmatrixDTO : DocumentApproved
    {
        public string Firstname { get; set; }
        public string Surname { get; set; }
        public List<Skill> Skills { get; set; } = new List<Skill>();
        public List<SkillDetail> SkillDetails { get; set; } = new List<SkillDetail>();
    }
    public class Skill : EntityBase
    {
        public Guid? GroupId { get; set; }
        public Guid? SubjectId { get; set; }
        public string SubjectGroup { get; set; }
        public string SubjectName { get; set; }
        public string ExpectedGrade { get; set; }
        public string FormSkill { get; set; }
    }
    public class SkillDetail : EntityBase
    {
        public Guid? DocumentNo { get; set; }
        public Guid? DocumentSkillNo { get; set; }
        public string Point { get; set; }
        public Guid? SubjectId { get; }
        public Guid? GradeId { get; }
        public string Description { get; set; }
        public string Score { get; set; }
        public string FormSkill { get; set; }
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

            sql.AppendLine(@"select e.employee_code ""EmployeeCode""
                                ,case when @Lang = 'th' then e.employee_firstname_th else e.employee_firstname_en end as ""Firstname""
                                ,case when @Lang = 'th' then e.employee_surname_th else e.employee_surname_en end as ""Surname""
                                ,da.document_no ""documentNo""
                                ,e.xmin ""rowVersion""
                                ,da.evaluation_status ""evaluationStatus""
                                ,case when @Lang = 'th' then s.desc_th else s.desc_en end ""Status""
                                from db.employee e 
                                inner join su.user u on u.user_id = e.user_id 
                                inner join db.position p on p.position_code  = e.position_code 
                                left join et.document_approved da ON da.employee_code = e.employee_code AND da.document_no = @documentNo
                                left join db.status s on da.evaluation_status = s.id
                                where e.user_id = @userId");
            result = await _context.QueryFirstOrDefaultAsync<SkillmatrixDTO>(sql.ToString(), new
            { DocumentNo = request.documentNo, userId = _user.UserId, Lang = _user.Language }, cancellationToken);
            
            sql = new StringBuilder();
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
                                        order by sms.subject_group asc");
            result.Skills = (List<Skill>)await _context.QueryAsync<Skill>(sql.ToString(), new
            { userId = _user.UserId}, cancellationToken);

/*            sql = new StringBuilder();
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
            { userId = _user.UserId}, cancellationToken);*/

            if (request.documentNo != null)
            {
                sql = new StringBuilder();
                sql.AppendLine(@"select smsg.subject_id ""SubjectId""
                                        ,smsg.grade_id ""GradeId""
                                        ,CONCAT(smsg.grade,'. ',smsg.description ) ""Description""
                                        ,smsg.score ""Score""
                                        ,e.form_skill ""FormSkill""
                                        ,e.xmin ""rowVersion""
                                        ,das.document_no ""DocumentNo""
                                    	,das.document_skill_no ""DocumentSkillNo""
                                        ,das.score ""Point""
										from db.employee e 
										left join et.skill_matrix_group smg on smg.group_name = e.form_skill 
										left join et.skill_matrix_subject sms on sms.group_id = smg.group_id 
										left join et.skill_matrix_grade smsg on smsg.subject_id = sms.subject_id 
										left join et.document_approved da on da.employee_code = e.employee_code 
										left join et.document_approved_skill das on das.document_no = da.document_no 
										and das.document_no = das.document_no 
										and das.grade_id = smsg.grade_id 
										where e.user_id = @userId and da.document_no = @documentNo
										order by sms.subject_group , smsg.grade asc");
                result.SkillDetails = (List<SkillDetail>)await _context.QueryAsync<SkillDetail>(sql.ToString(), new
                { DocumentNo = request.documentNo, userId = _user.UserId}, cancellationToken);
            }
            else
            {
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
                                        where e.user_id = @userId
                                        order by sms.subject_group , smsg.grade asc");

                result.SkillDetails = (List<SkillDetail>)await _context.QueryAsync<SkillDetail>(sql.ToString(), new
                { userId = _user.UserId}, cancellationToken);
            }

            return result;
        }
    }
}
