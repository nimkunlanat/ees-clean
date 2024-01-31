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
    public class ListSubDistrict
    {
        public class Query : IRequest<List<SubdistictDTO>>
        {
            public string Keywords { get; set; }
            public Guid DistrictCode { get; set; }
        }
        public class SubdistictDTO : Subdistrict
        {
            public Guid ProvinceCode { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<SubdistictDTO>>
        {

            private readonly ICleanDbContext _context;
            private readonly ICurrentUserAccessor _user;

            public Handler(ICleanDbContext context, ICurrentUserAccessor user)
            {
                _context = context;
                _user = user;
            }
            public async Task<List<SubdistictDTO>> Handle(Query request, CancellationToken cancellationToken)
            {
                StringBuilder sql = new StringBuilder();
                sql.AppendLine(@"select p.province_code ""provinceCode""
                                        ,d.district_code ""districtCode""
                                        ,subdistrict_code ""subdistrictCode""
						                ,subdistrict_th ""subdistrictTh""
						                ,subdistrict_en ""subdistrictEn"" 
						                ,postal_code ""postalCode"" 
						                ,d.active ""active""
		                                ,d.xmin ""rowVersion""
		                                ,case when @Lang = 'th' then d.district_th else d.district_en end as district
                                        ,case when @Lang = 'th' then p.province_th else p.province_en end as province
						                from db.subdistrict s 
		                                inner join db.district d  on  d.district_code  = s.district_code 
		                                inner join db.province p  on p.province_code = d.province_code 
		                                where d.district_code = @districtCode");

                if (request.Keywords != null) sql.AppendLine(@"and concat(s.subdistrict_th,s.subdistrict_en,s.postal_code) ilike concat('%',@Keywords,'%')");
                return (List<SubdistictDTO>) await _context.QueryAsync<SubdistictDTO>(sql.ToString() , new { districtCode = request.DistrictCode, Keywords = request.Keywords , Lang = _user.Language }, cancellationToken);
            }
        }
    }
}
