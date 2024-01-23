using Application.Interfaces;
using Domain.Entities.DB;
using MediatR;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.DB.DBRT04
{
    public class List
    {
        public class Query : IRequest<List<Province>>
        {
            public string Keywords { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<Province>>
        {
            private readonly ICleanDbContext _context;
            private readonly ICurrentUserAccessor _user;

            public Handler(ICleanDbContext context, ICurrentUserAccessor user)
            {
                _context = context;
                _user = user;
            }

            public async Task<List<Province>> Handle(Query request, CancellationToken cancellationToken)
            {
                StringBuilder sql = new StringBuilder();

                sql.AppendLine(@"select p.province_code ""provinceCode""
                                , p.province_thai ""provinceTh"" 
                                , p.province_eng ""provinceEn""
                                , p.active ""active""
                                , p.xmin ""rowVersion""
                                from db.province p
                                where 1=1");


                if (request.Keywords != null) sql.AppendLine(@"and concat(p.province_thai,p.province_eng) ilike concat('%',@Keywords,'%')");

                sql.AppendLine("order by p.province_thai");

                return await _context.QueryAsync<Province>(sql.ToString(), new { Lang = _user.Language, request.Keywords }, cancellationToken) as List<Province>;
            }
        }
    }
}