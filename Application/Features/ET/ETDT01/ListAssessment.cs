using Application.Interfaces;
using MediatR;
using System.Text;
using System.Threading.Tasks;
using System.Threading;
using System.Collections.Generic;

namespace Application.Features.ET.ETDT01;
public class ListAssessment
{
    public class Query : IRequest<AssessmentDTO>
    {

    }
    public class AssessmentDTO
    {
        public string EmployeeCode { get; set; }
        public string Firstname { get; set; }
        public string Surname { get; set; }
        public string PositionCode { get; set; }
        public string Position { get; set; }
        public string Email { get; set; }
        public List<Evaluate> Evaluates { get; set; } = new List<Evaluate>();
        public List<EvaluateDetail> EvaluateDetails { get; set; } = new List<EvaluateDetail>();
        public List<Status> Status { get; set; } = new List<Status>();
    }
    public class Evaluate
    {
        public string EvaluateGroupCode { get; set; }
        public int? TotalPoint { get; set; }
        public string EvaluateGroupName { get; set; }

    }
    public class EvaluateDetail
    {
        public string EvaluateGroupCode { get; set; }
        public string EvaluateDetailCode { get; set; }
        public string EvaluateDetailName { get; set; }
        public int? Point { get; set; }
    }

    public class Status
    {
        public string value { get; set; }
        public string label { get; set; }
        public string seq { get; set; }
    }


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
                                ,e.position_code ""PositionCode""
                                ,case when @Lang = 'th' then p.position_name_th else p.position_name_en end as ""Position""
                                ,e.email ""Email""
                                ,e.xmin ""rowVersion""
                                from db.employee e 
                                inner join su.user u on u.user_id = e.user_id 
                                inner join db.position p on p.position_code  = e.position_code 
                                where e.user_id = @userId");

            result = await _context.QueryFirstOrDefaultAsync<AssessmentDTO>(sql.ToString(), new
            { userId = _user.UserId, Lang = _user.Language }, cancellationToken);

            sql = new StringBuilder();
            sql.AppendLine(@"select eg.evaluate_group_code ""EvaluateGroupCode""
                                        ,case when @Lang = 'th' then eg.evaluate_group_name_th else eg.evaluate_group_name_en end as ""EvaluateGroupName""
                                        ,eg.total_point ""totalPoint""
                                        ,eg.xmin ""rowVersion""
                                        ,eg.role_code ""role""
                                        ,e.position_code 
                                        from et.evaluate_group eg 
                                        inner join db.employee e  on e.position_code  = eg.role_code 
                                        inner join et.evaluate_form ef on ef.role_code = eg.role_code 
                                       	where e.user_id = @userId
                                        order by eg.sequene_id asc");

            result.Evaluates = (List<Evaluate>)await _context.QueryAsync<Evaluate>(sql.ToString(), new
            { userId = _user.UserId, Lang = _user.Language }, cancellationToken);

            sql = new StringBuilder();
            sql.AppendLine(@"select ed.evaluate_group_code ""EvaluateGroupCode""
                                        ,case when @Lang = 'th' then ed.evaluate_detail_name_th else ed.evaluate_detail_name_en end as ""EvaluateDetailName""
                                        ,ed.point ""Point""
                                        ,ed.evaluate_detail_code ""EvaluateDetailCode""
                                        ,ed.xmin ""rowVersion""
                                        ,e.position_code 
                                        from et.evaluate_detail ed
                                        inner join et.evaluate_group eg on eg.evaluate_group_code = ed.evaluate_group_code 
                                        inner join db.employee e on e.position_code  = eg.role_code 
                                        where e.user_id = @userId
                                        order by ed.sequene_id asc");
            result.EvaluateDetails = (List<EvaluateDetail>)await _context.QueryAsync<EvaluateDetail>(sql.ToString(), new
            { userId = _user.UserId, Lang = _user.Language }, cancellationToken);

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