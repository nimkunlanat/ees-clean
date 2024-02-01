using Application.Interfaces;
using Domain.Entities.DB;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.DB.DBRT04
{
    public class ListDistrict
    {
        public class Query : IRequest<List<District>>
        {
            public string Keywords { get; set; }
            public Guid ProvinceCode { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<District>>
        {

            private readonly ICleanDbContext _context;
            private readonly ICurrentUserAccessor _user;

            public Handler(ICleanDbContext context, ICurrentUserAccessor user)
            {
                _context = context;
                _user = user;
            }
            public async Task<List<District>> Handle(Query request, CancellationToken cancellationToken)
            {
                StringBuilder sql = new StringBuilder();
                sql.AppendLine(@"select d.district_code ""districtCode""
		                        ,d.district_th ""districtTh""
		                        ,d.district_en ""districtEn"" 
		                        ,d.active ""active""
		                        ,d.xmin ""rowVersion""
                                ,p.province_code ""provinceCode""
		                        ,case when @Lang = 'th' then p.province_th else p.province_en end as province
		                        from db.district d 
		                        inner join db.province p on p.province_code = d.province_code
		                        where p.province_code = @provinceCode");

                if (request.Keywords != null) sql.AppendLine(@"and concat(d.district_th,d.district_en) ilike concat('%',@Keywords,'%')");
                return (List<District>) await _context.QueryAsync<District>(sql.ToString() , new { provinceCode = request.ProvinceCode , Keywords = request.Keywords , Lang = _user.Language }, cancellationToken);
            }
        }
    }
}
