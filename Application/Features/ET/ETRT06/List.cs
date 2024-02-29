using Application.Interfaces;
using Domain.Entities.ET;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.ET.ETRT06;

public class List
{
    public class Query : IRequest<List<SkillMatrixGroup>>
    {
        public string Keywords { get; set; }
    }
    public class Handler : IRequestHandler<Query, List<SkillMatrixGroup>>
    {
        private readonly ICleanDbContext _context;
        private readonly ICurrentUserAccessor _user;

        public Handler(ICleanDbContext context, ICurrentUserAccessor user)
        {
            _context = context;
            _user = user;
        }

        public async Task<List<SkillMatrixGroup>> Handle(Query request, CancellationToken cancellationToken)
        {
            StringBuilder sql = new StringBuilder();

            sql.AppendLine(@"select smg.group_id ""groupId""
                             , smg.group_name ""groupName""
                             , smg.active ""active""
                             , smg.description ""description""
                             , smg.xmin ""rowVersion""
                            from et.skill_matrix_group smg");

            if (request.Keywords != null) sql.AppendLine(@"where concat(smg.group_name, smg.description) ilike concat('%',@Keywords,'%')");

            sql.AppendLine("order by smg.group_name");

            return await _context.QueryAsync<SkillMatrixGroup>(sql.ToString(), new { request.Keywords }, cancellationToken) as List<SkillMatrixGroup>;
        }
    }
}
