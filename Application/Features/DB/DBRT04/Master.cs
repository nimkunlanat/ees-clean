using Application.Interfaces;
using MediatR;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Threading;
using Org.BouncyCastle.Asn1.Ocsp;
using System;

namespace Application.Features.DB.DBRT04;

public class Master
{
    public class MasterData
    {
        public IEnumerable<dynamic> Province { get; set; }
        public IEnumerable<dynamic> District { get; set; }
    }

    public class Query : IRequest<MasterData>
    {
        public Guid? ProvinceCode { get; set; }

        public Guid? DistrictCode { get; set;}
    }

    public class Handler : IRequestHandler<Query,MasterData>
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

            if (request.ProvinceCode != null)
            {
                sql.AppendLine(@"select p.province_code as value, 
                                    case when @Lang = 'th' then p.province_th else p.province_en end as label
                                        from db.province p"
                );

                master.Province = await _context.QueryAsync<dynamic>(sql.ToString(), new { provinceCode = request.ProvinceCode, Lang = _user.Language }, cancellationToken);
            }

            if (request.DistrictCode != null)
            {
                sql = new StringBuilder();
                sql.AppendLine(@"select d.district_code as value, 
                                    case when @Lang = 'th' then d.district_th else d.district_en end as label
                                        from db.district d"
                );
                master.District = await _context.QueryAsync<dynamic>(sql.ToString(), new { districtCode = request.DistrictCode, Lang = _user.Language }, cancellationToken);

            }

            return master;
        }
    }
}