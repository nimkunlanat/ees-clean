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
    }

    public class Query : IRequest<MasterData>
    {
        public Guid ProvinceCode { get; set; }
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
            master.Province = await GetProvince(request ,cancellationToken);

            return master;
        }
        private async Task<IEnumerable<dynamic>> GetProvince(Query request , CancellationToken cancellationToken)
        {
            StringBuilder sql = new StringBuilder();
            sql.AppendLine(@"select p.province_code as value, 
                                case when @Lang = 'th' then p.province_th else p.province_en end as label
                                    from db.province p where p.province_code = @provinceCode"
            );

            return await _context.QueryAsync<dynamic>(sql.ToString(), new { provinceCode = request.ProvinceCode , Lang = _user.Language }, cancellationToken);
        }

    }
}