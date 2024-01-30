using Application.Interfaces;
using Domain.Entities.DB;
using MediatR;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.DB.DBRT03;

public class Detail
{
    public class Query : IRequest<Position>
    {
        public string PositionCode { get; set; }
    }
    public class Handler : IRequestHandler<Query, Position>
    {
        private readonly ICleanDbContext _context;
        public Handler(ICleanDbContext context) => _context = context;
        public async Task<Position> Handle(Query request, CancellationToken cancellationToken)
        {
            StringBuilder sql = new StringBuilder();
            sql.AppendLine(@"select p.position_code ""positionCode""
	                            , p.position_name_th ""positionNameTh""
	                            , p.position_name_en ""positionNameEn""
	                            , p.description ""Description""
	                            , p.active ""Active""
	                            , p.xmin ""RowVersion""
                                from db.""position"" p 
                                where p.position_code = @PositionCode");

            return await _context.QueryFirstOrDefaultAsync<Position>(sql.ToString(), new { positionCode = request.PositionCode }, cancellationToken);
        }
    }
}

