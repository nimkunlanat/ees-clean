using Application.Interfaces;
using MediatR;
using System.Text;
using System.Threading.Tasks;
using System.Threading;
using Domain.Entities.DB;
using System;

namespace Application.Features.DB.DBRT01;

public class Detail
{
    public class Query : IRequest<Status>
    {
        public Guid Id { get; set; }
    }

    public class Handler : IRequestHandler<Query, Status>
    {
        private readonly ICleanDbContext _context;
        public Handler(ICleanDbContext context) => _context = context;
        public async Task<Status> Handle(Query request, CancellationToken cancellationToken)
        {
            StringBuilder sql = new StringBuilder();
            sql.AppendLine(@"select s.id ""id""
                                    , s.code ""code"" 
                                    , desc_th ""descTh""
                                    , desc_en ""descEn""
                                    , table_name ""tableName""
                                    , column_name ""columnName""
                                    , background_color ""backgroundColor""
                                    , font_color ""fontColor""
                                    , active ""active""
                                    , s.xmin ""rowVersion""
                                    from db.status s
                                    where id=@Id");

            return await _context.QueryFirstOrDefaultAsync<Status>(sql.ToString(), new { id = request.Id }, cancellationToken);
        }
    }
}