using Application.Interfaces;
using MediatR;
using System.Text;
using System.Threading.Tasks;
using System.Threading;
using Domain.Entities.DB;
using System;

namespace Application.Features.DB.DBRT04;

public class DetailDistrict
{
    public class Query : IRequest<DistictDTO>
    {
        public Guid DistrictCode { get; set; }

        public Guid ProvinceCode { get; set; }
    }

    public class DistictDTO : District
    {
        public string Province { get; set; }
    }

    public class Handler : IRequestHandler<Query, DistictDTO>
    {
        private readonly ICleanDbContext _context;
        private readonly ICurrentUserAccessor _user;
        public Handler(ICleanDbContext context, ICurrentUserAccessor user)
        {
            _context = context;
            _user = user;
        }
        public async Task<DistictDTO> Handle(Query request, CancellationToken cancellationToken)
        {
            StringBuilder sql = new StringBuilder();
            sql.AppendLine(@"select d.district_code ""districtCode""
                                ,p.province_code ""provinceCode""
		                        ,d.district_th ""districtTh""
		                        ,d.district_en ""districtEn"" 
                                ,d.description ""description""
		                        ,d.active ""active""
		                        ,d.xmin ""rowVersion""
                                ,case when @Lang = 'th' then p.province_th else p.province_en end as province
		                        from db.district d 
		                        inner join db.province p on p.province_code = d.province_code
		                        where d.district_code = @districtCode
                                and p.province_code = @provinceCode");

            
            return await _context.QueryFirstOrDefaultAsync<DistictDTO>(sql.ToString(), new { districtCode = request.DistrictCode , provinceCode = request.ProvinceCode, Lang = _user.Language }, cancellationToken);
        }
    }
}
