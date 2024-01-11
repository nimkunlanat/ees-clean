using Application.Interfaces;
using Domain.Entities.SU;
using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.SU.SURT05;
public class List
{
    public class Query : IRequest<List<Message>>
    {
        public string Keywords { get; set; }
    }
    public class Handler : IRequestHandler<Query, List<Message>>
    {
        private readonly ICleanDbContext _context;
        private readonly ICurrentUserAccessor _user;

        public Handler(ICleanDbContext context, ICurrentUserAccessor user)
        {
            _context = context;
            _user = user;
        }

        public async Task<List<Message>> Handle(Query request, CancellationToken cancellationToken)
        {
            StringBuilder sql = new StringBuilder();
            sql.AppendLine(@"SELECT 
	                                m.message_code ""messageCode"",
                                    m.message_desc ""messageDesc"",
                                    m.remark                                
                    FROM su.message m 
                    where m.message_desc is not null");

            if (!string.IsNullOrEmpty(request.Keywords)) sql.AppendLine("and concat(m.message_code,m.message_desc,m.remark) ilike concat('%',@Keywords,'%')");

            sql.AppendLine("and lower(language_code) = lower(@Lang)");
            
            sql.AppendLine("order by \"messageCode\"");

            return await _context.QueryAsync<Message>(sql.ToString(), new { Lang = _user.Language, request.Keywords }, cancellationToken) as List<Message>;
        }
    }
}
