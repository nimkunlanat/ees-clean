using Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Data.SqlTypes;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.ET.ETDT01;

public class Calculate
{
    public class Query : IRequest<AssessmentDTO>
    {
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
    }
    public class AssessmentDTO
    {
        public List<CalculateCode> CalculateCode { get; set; } = new List<CalculateCode>();
        public List<CalculateQuality> CalculateQuality { get; set; } = new List<CalculateQuality>();
    }
    public class CalculateCode
    {
        public string UserId { get; set; }
        public string Point { get; set;}
        public string Calculate { get; set; }

    }
    public class CalculateQuality
    {
        public string UserId { get; set; }
        public float? Quality { get; set; }

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
            AssessmentDTO result = new AssessmentDTO();
            int month = ((request.DateTo.Value.Year - request.DateFrom.Value.Year) * 12) + (request.DateTo.Value.Month - request.DateFrom.Value.Month); 
            if (month == 0)
            {
                month = +1;
            }
            //เช็ค 18 ตามตำแหน่ง // 20 ตามตำแหน่งเหมือนกัน

            StringBuilder sql = new StringBuilder();
            sql.AppendLine(@"select
                             e.user_id ""UserId"",
	                            tmp_point.point ""Point"",
                                Round(((tmp_point.point)/(18 * @month)) * 20, 2) as ""Calculate""
                                from db.employee e 
                                left join (select coalesce(SUM(t.points), 0) as point, e.user_id 
                                   from clickup.tasks t 
                                    left join clickup.assignees a on t.id = a.task_id
                                    left join clickup.tags tg on a.task_id = tg.task_id
                                    left join db.employee e on a.member_id = e.id_clickup
                                   where e.user_id = @userId
                                    and t.status  = 'closed' 
                                    and t.points != 0 
                                    and tg.""name"" not in ('bug', 'ลาป่วย', 'ลาไปตรวจครรภ์', 'ลากิจ', 'ลาพักร้อน')
                                    and t.date_closed::date between COALESCE(@dateFrom, CURRENT_DATE) and COALESCE(@dateTo, CURRENT_DATE)
                                   group by e.user_id
                                   ) tmp_point on e.user_id = e.user_id
                                where e.user_id = @userId");
            result.CalculateCode = (List<CalculateCode>)await _context.QueryAsync<CalculateCode>(sql.ToString(), new
            { userId = _user.UserId, dateFrom = request.DateFrom, dateTo = request.DateTo ,month }, cancellationToken);

            sql = new StringBuilder();
            sql.AppendLine(@"select e.user_id, coalesce(Round((sum(dev.noDev) / (sum(dev.noDev) + sum(bug.noBug))) * 10 , 2), 10) as Quality
	                                from clickup.assignees a
	                                left join (
	                                 select tg.task_id , tg.name , count(tg.name) as noBug
	                                 from clickup.tags tg 
	                                 left join clickup.assignees a on tg.task_id = a.task_id 
 	                                 left join clickup.tasks t on t.id = a.task_id 
	                                 where tg.name in ('bug')
	                                 and t.status = 'closed'
	                                 and t.date_closed::date between COALESCE(@DateFrom, CURRENT_DATE) and COALESCE(@DateTo, CURRENT_DATE)
	                                 group by tg.task_id , tg.name
	                                ) bug on a.task_id = bug.task_id
	                                left join  (
	                                 select tg.task_id , tg.name , count(tg.name) as noDev
	                                 from clickup.tags tg 
	                                 left join clickup.assignees a on tg.task_id = a.task_id 
 	                                 left join clickup.tasks t on t.id = a.task_id 
	                                 where tg.name in ('dev' ,'develop')
	                                 and t.status = 'closed'
	                                 and t.date_closed::date between COALESCE(@DateFrom, CURRENT_DATE) and COALESCE(@DateTo, CURRENT_DATE)
	                                 group by tg.task_id, tg.name
	                                ) dev on a.task_id = dev.task_id
	                                left join clickup.tasks t on t.id = a.task_id 
	                                left join db.employee e on a.member_id = e.id_clickup
	                                 where e.user_id = @userId 
	                                 and t.status = 'closed'
	                                 and t.date_closed::date between COALESCE(@DateFrom, CURRENT_DATE) and COALESCE(@DateTo, CURRENT_DATE)
	                                 group by e.user_id");
            result.CalculateQuality = (List<CalculateQuality>)await _context.QueryAsync<CalculateQuality>(sql.ToString(), new
            { userId = _user.UserId, dateFrom = request.DateFrom, dateTo = request.DateTo }, cancellationToken);
            return result;

        }

    }
}
