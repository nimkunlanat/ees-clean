using Application.Interfaces;
using Domain.Entities.DB;
using MediatR;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.DB.DBRT01
{
    public class List
    {
        public class Query : IRequest<List<Status>>
        {
            public string Keywords { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<Status>>
        {
            private readonly ICleanDbContext _context;
            private readonly ICurrentUserAccessor _user;

            public Handler(ICleanDbContext context, ICurrentUserAccessor user)
            {
                _context = context;
                _user = user;
            }

            public async Task<List<Status>> Handle(Query request, CancellationToken cancellationToken)
            {
                StringBuilder sql = new StringBuilder();

                sql.AppendLine(@"select s.id ""id""
                                , s.code ""code"" 
                                , desc_th ""descTh""
                                , desc_en ""descEn""
                                , table_name ""tableName""
                                , column_name ""columnName""
                                , active ""active""
                                , s.xmin ""rowVersion""
                                from db.status s
                                where 1=1");

                if (request.Keywords != null) sql.AppendLine(@"and concat(s.desc_th,s.desc_en,s.table_name,s.column_name) ilike concat('%',@Keywords,'%')");

                sql.AppendLine("order by s.code");

                return await _context.QueryAsync<Status>(sql.ToString(), new { Lang = _user.Language, request.Keywords }, cancellationToken) as List<Status>;
            }
        }
    }
}
