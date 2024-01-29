using Application.Interfaces;
using Domain.Entities.SU;
using MediatR;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.SU.SURT08;

public class List
{
    public class Query : IRequest<List<ActivityLog>>
    {
        public string Keywords { get; set; }
    }

    public class Handler : IRequestHandler<Query, List<ActivityLog>>
    {
        private readonly ICleanDbContext _context;

        public Handler(ICleanDbContext context) => _context = context;

        public async Task<List<ActivityLog>> Handle(Query request, CancellationToken cancellationToken)
        {
            StringBuilder sql = new StringBuilder();

            sql.AppendLine(@"select 
                                al.id,
	                            al.activity_type_code ""activityTypeCode"",
	                            al.log_message ""logMessage"",
	                            al.logged_by ""loggedBy"",
	                            al.logged_date ""loggedDate"",
	                            al.created_program ""createdProgram""
                            from su.activity_log al
                            where concat(al.activity_type_code, al.log_message, al.logged_by, al.created_program) ilike concat('%', @Keywords, '%')
                            order by al.created_date desc
                ");

            return await _context.QueryAsync<ActivityLog>(sql.ToString(), new { request.Keywords }, cancellationToken) as List<ActivityLog>;
        }
    }
}
