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
        public class Query : IRequest<List<DocumentApprovedDTO>>

        {
            public string yearFrom { get; set; }
            public string yearTo { get; set; }

        }
        public class DocumentApprovedDTO : DocumentApproved
        {
            public string employeeName { get; set; }
            public int? Evaluated { get; set; }
            public int? NotEvaluated { get; set; }
        }
        public class Handler : IRequestHandler<Query, List<DocumentApprovedDTO>>   
        {
            private readonly ICleanDbContext _context;
            private readonly ICurrentUserAccessor _user;
            public Handler(ICleanDbContext context, ICurrentUserAccessor user)
            {
                _context = context;
                _user = user;
            }
            public async Task<List<DocumentApprovedDTO>> Handle(Query request, CancellationToken cancellationToken)
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

                List<DocumentApprovedDTO> documentApproved = new List<DocumentApprovedDTO>();

                foreach(var data in assisgnmentDateArray)
                {
                    StringBuilder sql = new StringBuilder();
                    sql.AppendLine(@"select
	                                        (select count(s.code) 
	                                            from et.document_approved da2 
	                                            left join db.status s on da2.evaluation_status = s.id
	                                            where s.code in ('Approval', 'Waiting Approval') and s.code != 'NotFound'
	                                                and da2.approve_by = (select e.employee_code from db.employee e where e.user_id = @UserId)
	                                                and da2.created_date::date between @dateFrom::date and @dateTo::date) ""Evaluated"",
	                                        (select count(s.code) 
	                                            from et.document_approved da2 
	                                            left join db.status s on da2.evaluation_status = s.id
	                                            where s.code in ('Draft Document') and s.code != 'NotFound'
	                                                and da2.approve_by = (select e.employee_code from db.employee e where e.user_id = @UserId)
	                                                and da2.created_date::date between @dateFrom::date and @dateTo::date) ""NotEvaluated""
	                                        from et.document_approved da
	                                        left join db.employee e on da.employee_code = e.employee_code and da.approve_by = e.employee_code
	                                        left join tm.member_hierarchy mh on e.user_id = mh.user_id 
	                                        where da.approve_by = (select e.employee_code from db.employee e where e.user_id = @UserId)
	                                        and da.created_date::date between @dateFrom::date and @dateTo::date");

                    DocumentApprovedDTO result = await _context.QueryFirstOrDefaultAsync<DocumentApprovedDTO>(sql.ToString(), new { userId = _user.UserId, dateFrom = data.Item1.ToString(), dateTo = data.Item2.ToString() }, cancellationToken);

                    documentApproved.Add(result);
                }

                return documentApproved;
            }
        }
    }
}


