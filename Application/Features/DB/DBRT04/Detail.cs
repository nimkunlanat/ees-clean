using Application.Interfaces;
using MediatR;
using System.Text;
using System.Threading.Tasks;
using System.Threading;
using Domain.Entities.DB;
using System;

namespace Application.Features.DB.DBRT04;

public class Detail
{
    public class Query : IRequest<Province>
    {
        public Guid ProvinceCode { get; set; }
    }

    public class Handler : IRequestHandler<Query, Province>
    {
        private readonly ICleanDbContext _context;
        public Handler(ICleanDbContext context) => _context = context;
        public async Task<Province> Handle(Query request, CancellationToken cancellationToken)
        {
            StringBuilder sql = new StringBuilder();
            sql.AppendLine(@"select p.province_code ""provinceCode""
                                , p.province_th ""provinceTh""
                                , p.province_en ""provinceEn""
                                , p.active ""active""
                                , p.description ""description""
                                , p.xmin ""rowVersion""
                                from db.province p
                                where p.province_code = @provinceCode");

            return await _context.QueryFirstOrDefaultAsync<Province>(sql.ToString(), new { provinceCode = request.ProvinceCode }, cancellationToken);
        }
    }
}
