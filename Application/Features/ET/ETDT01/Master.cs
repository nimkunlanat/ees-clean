using Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.ET.ETDT01
{
    public class Master
    {
        public class MasterData
        {
            public IEnumerable<dynamic> Status { get; set; }
        }

        public class Query : IRequest<MasterData>
        {

        }

        public class Handler : IRequestHandler<Query, MasterData>
        {
            private readonly ICleanDbContext _context;
            private readonly ICurrentUserAccessor _user;

            public Handler(ICleanDbContext context, ICurrentUserAccessor user)
            {
                _context = context;
                _user = user;
            }

            public async Task<MasterData> Handle(Query request, CancellationToken cancellationToken)
            {
                MasterData master = new MasterData();
                StringBuilder sql = new StringBuilder();
                sql.AppendLine(@"select id as value
                                    ,case when @Lang = 'th' then s.desc_th else s.desc_en end as label
                                    from db.status s 
                                    where table_name = 'ETDT01'
                                    order by s.seq");
                master.Status =await _context.QueryAsync<dynamic>(sql.ToString(), new { Lang = _user.Language }, cancellationToken);

                return master;
            }
        }

    }
}
