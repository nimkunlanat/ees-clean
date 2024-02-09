using Application.Interfaces;
using Domain.Entities.ET;
using MediatR;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.ET.ETRT05;
public class Detail
{
    public class Query : IRequest<EvaluateGroup>
    {
        public string EvaluateGroupCode { get; set; }
    }
    public class Handler : IRequestHandler<Query, EvaluateGroup>
    {
        private readonly ICleanDbContext _context;
        public Handler(ICleanDbContext context) => _context = context;
        public async Task<EvaluateGroup> Handle(Query request, CancellationToken cancellationToken)
        {
            StringBuilder sql = new StringBuilder();
            EvaluateGroup evaluationGroup = new();

             sql.AppendLine(@"select eg.evaluate_group_code ""evaluateGroupCode""
                                    , eg.evaluate_group_name_th ""evaluateGroupNameTh""
                                    , eg.evaluate_group_name_en ""evaluateGroupNameEn""
                                    , eg.total_point ""totalPoint""
                                    , eg.active ""active""
                                    , eg.sequene_id ""sequeneId""
                                    , eg.xmin ""rowVersion""
                                    from et.evaluate_group eg
                                    where eg.evaluate_group_code = @evaluateGroupCode");

            evaluationGroup = await _context.QueryFirstOrDefaultAsync<EvaluateGroup>(sql.ToString(), new { evaluateGroupCode = request.EvaluateGroupCode }, cancellationToken);

            if (evaluationGroup != null)
            {
                sql = new StringBuilder();
                sql.AppendLine(@"select ed.evaluate_group_code ""evaluateGroupCode""
                                        , ed.evaluate_detail_code ""evaluateDetailCode""
                                        , ed.evaluate_detail_name_th ""evaluateDetailNameTh""
                                        , ed.evaluate_detail_name_en ""evaluateDetailNameEn""
                                        , ed.point ""Point""
                                        , ed.sequene_id ""sequeneId""
                                        , ed.active ""active""
                                        , ed.xmin ""rowVersion""
                                        from et.evaluate_detail ed 
                                        where ed.evaluate_group_code = @evaluateGroupCode
                                        order by evaluate_detail_code asc");

                evaluationGroup.EvaluateDetails = await _context.QueryAsync<EvaluateDetail>(sql.ToString(), new { evaluateGroupCode = request.EvaluateGroupCode }, cancellationToken) as List<EvaluateDetail>;
            }

            return evaluationGroup;
        }
    }
}
