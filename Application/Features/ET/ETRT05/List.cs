using Application.Interfaces;
using Domain.Entities.ET;
using MediatR;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.ET.ETRT05;

public class List
{
    public class Query : IRequest<List<EvaluateGroup>>
    {
        public string Keywords { get; set; }
    }

    public class Handler : IRequestHandler<Query, List<EvaluateGroup>>
    {
        private readonly ICleanDbContext _context;
        private readonly ICurrentUserAccessor _user;

        public Handler(ICleanDbContext context, ICurrentUserAccessor user)
        {
            _context = context;
            _user = user;
        }

        public async Task<List<EvaluateGroup>> Handle(Query request, CancellationToken cancellationToken)
        {
            StringBuilder sql = new StringBuilder();

            sql.AppendLine(@"select eg.evaluate_group_code ""evaluateGroupCode""
                                    , eg.evaluate_group_name_th ""evaluateGroupNameTh""
                                    , eg.evaluate_group_name_en ""evaluateGroupNameEn""
                                    , eg.total_point ""totalPoint""
                                    , eg.active ""active""
                                    , eg.sequene_id ""sequeneId""
                                    , eg.xmin ""rowVersion""
                                    from et.evaluate_group eg");



            if (request.Keywords != null) sql.AppendLine(@"where concat(eg.evaluate_group_code, eg.evaluate_group_name_th, eg.evaluate_group_name_en, eg.total_point) ilike concat('%',@Keywords,'%')");

            sql.AppendLine("order by eg.sequene_id");

            return await _context.QueryAsync<EvaluateGroup>(sql.ToString(), new { request.Keywords }, cancellationToken) as List<EvaluateGroup>;
        }
    }
}
