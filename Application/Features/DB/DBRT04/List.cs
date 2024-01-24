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

            public Handler(ICleanDbContext context)
            {
                _context = context;
            }

            public async Task<List<Province>> Handle(Query request, CancellationToken cancellationToken)
            {
                StringBuilder sql = new StringBuilder();

                sql.AppendLine(@"select p.province_code ""provinceCode""
                                , p.province_th ""provinceTh"" 
                                , p.province_en ""provinceEn""
                                , p.active ""active""
                                , p.xmin ""rowVersion""
                                from db.province p
                                where 1=1");


                if (request.Keywords != null) sql.AppendLine(@"and concat(p.province_th,p.province_en) ilike concat('%',@Keywords,'%')");

                sql.AppendLine("order by p.province_th");

                return await _context.QueryAsync<Province>(sql.ToString(), new {request.Keywords }, cancellationToken) as List<Province>;
            }
        }
    }
}