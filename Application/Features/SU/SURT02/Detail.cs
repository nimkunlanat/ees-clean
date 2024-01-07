using Application.Interfaces;
using MediatR;
using System.Text;
using System.Threading.Tasks;
using System.Threading;

namespace Application.Features.SU.SURT02;

public class Detail
{
    public class Query : IRequest<MenuDTO>
    {
        public string MenuCode { get; set; }
    }
    public class MenuDTO : Domain.Entities.SU.Menu
    {
        public string MenuNameTH { get; set; }
        public string MenuNameEN { get; set; }
    }

    public class Handler : IRequestHandler<Query, MenuDTO>
    {
        private readonly ICleanDbContext _context;
        public Handler(ICleanDbContext context) => _context = context;
        public async Task<MenuDTO> Handle(Query request, CancellationToken cancellationToken)
        {
            StringBuilder sql = new StringBuilder();
            sql.AppendLine(@"select 
                                    sm.menu_code ""menuCode"",
                                    sm.main_menu ""mainMenu"",
                                    sm.program_code ""programCode"",
                                    sm.active,
                                    sm.icon,
                                    sm.system_code ""systemCode"",
                                    sm.xmin ""rowVersion"",
                                    (select sml.menu_name from su.menu_label sml where sm.menu_code = sml.menu_code and sml.language_code = 'TH') as ""menuNameTH"", 
                                    (select sml.menu_name from su.menu_label sml where sm.menu_code = sml.menu_code and sml.language_code = 'EN') as ""menuNameEN""
                                    from su.menu sm
                                    where sm.menu_code = @menuCode");

            return await _context.QueryFirstOrDefaultAsync<MenuDTO>(sql.ToString(), new { menuCode = request.MenuCode }, cancellationToken);
        }
    }
}
