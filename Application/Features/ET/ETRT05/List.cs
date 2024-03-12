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
    public class Query : IRequest<List<EvaluateFormDTO>>
    {
        public string Keywords { get; set; }
    }

    public class EvaluateFormDTO : EvaluateForm
    {
        public string RoleName { get; set; }
    }

    public class Handler : IRequestHandler<Query, List<EvaluateFormDTO>>
    {
        private readonly ICleanDbContext _context;
        private readonly ICurrentUserAccessor _user;

        public Handler(ICleanDbContext context, ICurrentUserAccessor user)
        {
            _context = context;
            _user = user;
        }

        public async Task<List<EvaluateFormDTO>> Handle(Query request, CancellationToken cancellationToken)
        {
            StringBuilder sql = new StringBuilder();

            sql.AppendLine(@"select ef.role_code ""roleCode""
                             , CASE WHEN @Lang = 'th' THEN ef.role_name_th ELSE ef.role_name_en END as ""roleName""
                             , ef.role_name_th ""RoleNameTh""
                             , ef.role_name_en ""RoleNameEn""
                             , ef.active ""active""
                             , ef.language_code ""languageCode""
                             , ef.xmin ""rowVersion""
                             from et.evaluate_form ef 
                             order by ef.sequene_id ");

            if (request.Keywords != null) sql.AppendLine(@"where concat( ef.role_code, ef.role_name_th, ef.role_name_en) ilike concat('%',@Keywords,'%')");

            return await _context.QueryAsync<EvaluateFormDTO>(sql.ToString(), new { Lang = _user.Language, request.Keywords }, cancellationToken) as List<EvaluateFormDTO>;
        }
    }
}






