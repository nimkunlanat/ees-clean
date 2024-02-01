using Application.Interfaces;
using MediatR;
using System.Text;
using System.Threading.Tasks;
using System.Threading;
using Domain.Entities.DB;
using System;

namespace Application.Features.DB.DBRT04;

public class DetailSubdistrict
{
    public class Query : IRequest<SubdistictDTO>
    {
        public Guid SubdistrictCode { get; set; }

        public Guid DistrictCode { get; set; }
    }

    public class SubdistictDTO : Subdistrict
    {
        public Guid ProvinceCode { get; set; }
    }

    public class Handler : IRequestHandler<Query, SubdistictDTO>
    {
        private readonly ICleanDbContext _context;
        private readonly ICurrentUserAccessor _user;
        public Handler(ICleanDbContext context, ICurrentUserAccessor user)
        {
            _context = context;
            _user = user;
        }
        public async Task<SubdistictDTO> Handle(Query request, CancellationToken cancellationToken)
        {
            StringBuilder sql = new StringBuilder();
            sql.AppendLine(@"select p.province_code ""provinceCode""
                                    ,d.district_code ""districtCode""
                                    ,subdistrict_code ""subdistrictCode""
						            ,subdistrict_th ""subdistrictTh""
						            ,subdistrict_en ""subdistrictEn"" 
						            ,postal_code ""postalCode"" 
                                    ,s.description ""description""
						            ,d.active ""active""
		                            ,d.xmin ""rowVersion""
		                            ,case when @Lang = 'th' then d.district_th else d.district_en end as district
                                    ,case when @Lang = 'th' then p.province_th else p.province_en end as province
						            from db.subdistrict s 
		                            inner join db.district d  on  d.district_code  = s.district_code 
		                            inner join db.province p  on p.province_code = d.province_code 
		                            where d.district_code = @districtCode
                                    and s.subdistrict_code = @subdistrictCode");
            
            return await _context.QueryFirstOrDefaultAsync<SubdistictDTO>(sql.ToString(), new { subdistrictCode = request.SubdistrictCode,
                districtCode = request.DistrictCode, Lang = _user.Language ,}, cancellationToken);
        }
    }
}
