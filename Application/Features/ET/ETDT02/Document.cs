using Application.Interfaces;
using Domain.Entities.ET;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.ET.ETDT02
{
    public class Document
    {
        public class Query : IRequest<List<DocumentApproved>>

        {
            public string yearFrom { get; set; }
            public string yearTo { get; set; }

        }
        public class Handler : IRequestHandler<Query, List<DocumentApproved>>   
        {
            private readonly ICleanDbContext _context;
            private readonly ICurrentUserAccessor _user;
            public Handler(ICleanDbContext context, ICurrentUserAccessor user)
            {
                _context = context;
                _user = user;
            }
            public async Task<List<DocumentApproved>> Handle(Query request, CancellationToken cancellationToken)
            {
                DateTime? getDate = DateTime.Now;
                
                //Assignment1Date
                string assignment1DateFrom = "'" + getDate.Value.Year.ToString() + "-04-01'";
                string assignment1DateTo = "'" + getDate.Value.Year.ToString() + "-07-31'";

                //Assignment2Date
                string assignment2DateFrom = "'" + (getDate.Value.Year - 1).ToString() + "-11-01'";
                string assignment2DateTo = "'" + getDate.Value.Year.ToString() + "-01-31'";

                var assisgnmentDateArray = new Tuple<string, string>[2];

                // Creating objects with two keys for each element
                assisgnmentDateArray[0] = Tuple.Create(assignment1DateFrom, assignment1DateTo);
                assisgnmentDateArray[1] = Tuple.Create(assignment2DateFrom, assignment2DateTo);

                List<DocumentApproved> documentApproved = new List<DocumentApproved>();

                foreach(var data in assisgnmentDateArray)
                {
                    StringBuilder sql = new StringBuilder();
                    sql.AppendLine(@"select
	                                    (select count(da2.evaluation_status) 
		                                    from et.document_approved da2 
		                                    where da2.evaluation_status in ('Approval', 'Waiting Approval') and da2.evaluation_status != 'NotFound'
			                                    and da2.approve_by = (select e.employee_code from db.employee e where e.user_id = @UserId)
                                                and da2.created_date::date between @dateFrom::date and @dateTo::date) ""Evaluated"",
	                                    (select count(da2.evaluation_status) 
		                                    from et.document_approved da2 
		                                    where da2.evaluation_status in ('Draft Document') and da2.evaluation_status != 'NotFound'
			                                    and da2.approve_by = (select e.employee_code from db.employee e where e.user_id = @UserId)
                                                and da2.created_date::date between @dateFrom::date and @dateTo::date) ""NotEvaluated""
                                    from et.document_approved da 
                                    left join db.employee e on da.employee_code = e.employee_code and da.approve_by = e.employee_code
                                    left join tm.member_hierarchy mh on e.user_id = mh.user_id 
                                    where da.approve_by = (select e.employee_code from db.employee e where e.user_id = @UserId)
                                    and da.created_date::date between @dateFrom::date and @dateTo::date");

                    DocumentApproved result = await _context.QueryFirstOrDefaultAsync<DocumentApproved>(sql.ToString(), new { userId = _user.UserId, dateFrom = data.Item1.ToString(), dateTo = data.Item2.ToString() }, cancellationToken);

                    documentApproved.Add(result);
                }

                return documentApproved;
            }
        }
    }
}


