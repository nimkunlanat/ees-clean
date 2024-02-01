using Application.Interfaces;
using Domain.Entities.DB;
using MediatR;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.DB.DBRT03
{
    public class List
    {
        public class Query : IRequest<List<PositionDTO>>
        {
            public string Keywords { get; set; }
        }

        public class PositionDTO : Position
        {
            public string positionName { get; set; }
        }
        public class Handler : IRequestHandler<Query, List<PositionDTO>>
        {
            private readonly ICleanDbContext _context;
            private readonly ICurrentUserAccessor _user;

            public Handler(ICleanDbContext context, ICurrentUserAccessor user)
            {
                _context = context;
                _user = user;
            }

            public async Task<List<PositionDTO>> Handle(Query request, CancellationToken cancellationToken)
            {
                StringBuilder sql = new StringBuilder();

                sql.AppendLine(@"select position_code ""positionCode""
	                             , case when @Lang = 'th' then p.position_name_th else p.position_name_en end as ""positionName""
                                 , active ""active""
                                 , p.xmin ""rowVersion""
                                 from db.""position"" p
                                 where 1 = 1");

                if (request.Keywords != null) sql.AppendLine(@"and concat(p.position_code, p.position_name_th, p.position_name_en) ilike concat('%',@Keywords,'%')");

                sql.AppendLine("order by p.position_code");

                return await _context.QueryAsync<PositionDTO>(sql.ToString(), new { Lang = _user.Language, request.Keywords }, cancellationToken) as List<PositionDTO>;
            }
        }
    }
}
