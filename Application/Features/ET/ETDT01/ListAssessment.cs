using Application.Interfaces;
using MediatR;
using System.Text;
using System.Threading.Tasks;
using System.Threading;
using System.Collections.Generic;
using System;
using Domain.Entities.ET;
using Domain.Entities;

namespace Application.Features.ET.ETDT01;
public class ListAssessment
{
    public class Query : IRequest<AssessmentDTO>
    {
        public Guid? documentNo { get; set; }
    }
    public class AssessmentDTO : DocumentApproved
    {
        public string Firstname { get; set; }
        public string Surname { get; set; }
        public string PositionCode { get; set; }
        public string Position { get; set; }
        public string Email { get; set; }
        public string Status { get; set; }
        public List<Evaluate> Evaluates { get; set; } = new List<Evaluate>();
        public List<EvaluateDetail> EvaluateDetails { get; set; } = new List<EvaluateDetail>();
    }
    public class Evaluate : EntityBase
    {
        public string EvaluateGroupCode { get; set; }
        public int? TotalPoint { get; set; }
        public string EvaluateGroupName { get; set; }
        public string RoleCode { get; set; }

    }
    public class EvaluateDetail : EntityBase
    {
        public Guid? DocumentNo { get; set; }
        public Guid? DocumentDetailNo { get; set; }
        public string EvaluateGroupCode { get; set; }
        public string EvaluateDetailCode { get; set; }
        public string EvaluateDetailName { get; set; }
        public float? Point { get; set; }
        public int? ExPoint { get; set; }
    }

/*    public class Point 
    {
        public Guid? DocumentNo { get; set; }
        public Guid? DocumentDetailNo { get; set; }
        public string EvaluateDetailCode { get; set; }
        public string PointDetail { get; set; }
    }*/


    public class Handler : IRequestHandler<Query, AssessmentDTO>
    {
        private readonly ICleanDbContext _context;
        private readonly ICurrentUserAccessor _user;

        public Handler(ICleanDbContext context, ICurrentUserAccessor user)
        {
            _context = context;
            _user = user;
        }

        public async Task<AssessmentDTO> Handle(Query request, CancellationToken cancellationToken)
        {
            StringBuilder sql = new StringBuilder();
            AssessmentDTO result = new();

            sql.AppendLine(@"select e.employee_code ""EmployeeCode""
                                ,case when @Lang = 'th' then e.employee_firstname_th else e.employee_firstname_en end as ""Firstname""
                                ,case when @Lang = 'th' then e.employee_surname_th else e.employee_surname_en end as ""Surname""
                                ,e.position_code ""positionCode""
                                ,case when @Lang = 'th' then p.position_name_th else p.position_name_en end as ""Position""
                                ,e.email ""Email""
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

            result = await _context.QueryFirstOrDefaultAsync<AssessmentDTO>(sql.ToString(), new
            { DocumentNo = request.documentNo , userId = _user.UserId, Lang = _user.Language }, cancellationToken);

            sql = new StringBuilder();
            sql.AppendLine(@"select eg.evaluate_group_code ""EvaluateGroupCode""
                                        ,case when @Lang = 'th' then eg.evaluate_group_name_th else eg.evaluate_group_name_en end as ""EvaluateGroupName""
                                        ,eg.total_point ""totalPoint""
                                        ,eg.xmin ""rowVersion""
                                        ,eg.role_code ""roleCode""
                                        ,e.position_code ""positionCode""
                                        from et.evaluate_group eg 
                                        inner join db.employee e  on e.position_code  = eg.role_code 
                                        inner join et.evaluate_form ef on ef.role_code = eg.role_code 
                                       	where e.user_id = @userId
                                        order by eg.sequene_id asc");

            result.Evaluates = (List<Evaluate>)await _context.QueryAsync<Evaluate>(sql.ToString(), new
            { userId = _user.UserId, Lang = _user.Language }, cancellationToken);

            if(request.documentNo != null)
            {
                sql = new StringBuilder();
                sql.AppendLine(@"select 
                                    ed.evaluate_group_code ""EvaluateGroupCode""
                                    ,case when @Lang = 'th' then ed.evaluate_detail_name_th else ed.evaluate_detail_name_en end as ""EvaluateDetailName""
                                    ,ed.point ""ExPoint""
                                    ,ed.evaluate_detail_code ""EvaluateDetailCode""
                                    ,e.xmin ""rowVersion""
                                    ,e.position_code ""positionCode""
                                    ,coalesce(dad.point, null) ""Point""
                                    ,dad.document_no ""DocumentNo""
                                    ,dad.document_detail_no ""DocumentDetailNo""
                                from db.employee e
                                    left join et.evaluate_form ef on e.position_code = ef.role_code 
                                    left join et.evaluate_group eg on ef.role_code = eg.role_code
                                    left join et.evaluate_detail ed on eg.evaluate_group_code = ed.evaluate_group_code
                                    left join et.document_approved da on e.employee_code = da.employee_code 
                                    left join et.document_approved_detail dad on da.document_no = dad.document_no 
	                                        and dad.document_no = dad.document_no
	                                        and ed.evaluate_detail_code = dad.evaluate_detail_code
                                where e.user_id = @userId and da.document_no = @documentNo
                                order by ed.evaluate_detail_code asc ,ed.sequene_id asc");
                result.EvaluateDetails = (List<EvaluateDetail>)await _context.QueryAsync<EvaluateDetail>(sql.ToString(), new
                { DocumentNo = request.documentNo, userId = _user.UserId, Lang = _user.Language }, cancellationToken);
            }
            else
            {
                sql = new StringBuilder();
                sql.AppendLine(@"select 
                                    ed.evaluate_group_code ""EvaluateGroupCode""
                                    ,case when @Lang = 'th' then ed.evaluate_detail_name_th else ed.evaluate_detail_name_en end as ""EvaluateDetailName""
                                    ,ed.point ""ExPoint""
                                    ,ed.evaluate_detail_code ""EvaluateDetailCode""
                                    ,ef.xmin ""rowVersion""
                                    ,ef.role_code ""positionCode""
                                from et.evaluate_form ef
                                    inner join et.evaluate_group eg on ef.role_code = eg.role_code
                                    inner join et.evaluate_detail ed on eg.evaluate_group_code = ed.evaluate_group_code
                                where ef.role_code = @RoleCode
                                order by ed.evaluate_detail_code asc ,ed.sequene_id asc");

                result.EvaluateDetails = (List<EvaluateDetail>)await _context.QueryAsync<EvaluateDetail>(sql.ToString(), new
                { DocumentNo = request.documentNo, userId = _user.UserId, Lang = _user.Language, RoleCode = result.Evaluates[0].RoleCode }, cancellationToken);
            }

            return result;
        }
    }
}