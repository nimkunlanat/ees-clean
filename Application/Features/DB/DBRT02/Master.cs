using Application.Interfaces;
using MediatR;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.DB.DBRT02;

public class Master
{
    public class MasterData
    {
        public IEnumerable<dynamic> Lang { get; set; }
        public IEnumerable<dynamic> PositionCode { get; set; }
        public IEnumerable<dynamic> Gender { get; set; }
        public IEnumerable<dynamic> Nationality { get; set; }
        public IEnumerable<dynamic> Religion { get; set; }
    }

    public class Query : IRequest<MasterData>
    {

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
            master.PositionCode = await GetPositionCode(cancellationToken);

            master.Lang = await _context.QueryAsync<dynamic>(@"select l.language_code as value , 
	                                                                           ll.language_name as label 
                                                                       from db.language l 
                                                                       inner join db.language_lang ll on l.language_code = ll.language_code 
                                                                       where lower(ll.language_code_forname) = lower(@language)
                                                                       order by case when l.language_code = 'TH' then 1 end", new { language = _user.Language }, cancellationToken);

            master.Gender = await _context.QueryAsync<dynamic>(@"select dli.list_item_code as value ,  
   	                                                                        case when @language = 'th' then dli.list_item_name_tha 
   	                                                                        else coalesce(dli.list_item_name_eng, dli.list_item_name_tha) end as label
                                                                            from db.list_item dli 
                                                                            where dli.list_item_group_code = 'Gender' 
                                                                            order by dli.sequence", new { language = _user.Language }, cancellationToken);
            
            master.Nationality = await _context.QueryAsync<dynamic>(@"select dli.list_item_code as value ,  
   	                                                                        case when @language = 'th' then dli.list_item_name_tha 
   	                                                                        else coalesce(dli.list_item_name_eng, dli.list_item_name_tha) end as label
                                                                            from db.list_item dli 
                                                                            where dli.list_item_group_code = 'Nationality' 
                                                                            order by dli.sequence", new { language = _user.Language }, cancellationToken);

            master.Religion = await _context.QueryAsync<dynamic>(@"select dli.list_item_code as value ,  
   	                                                                        case when @language = 'th' then dli.list_item_name_tha 
   	                                                                        else coalesce(dli.list_item_name_eng, dli.list_item_name_tha) end as label
                                                                            from db.list_item dli 
                                                                            where dli.list_item_group_code = 'Religion' 
                                                                            order by dli.sequence", new { language = _user.Language }, cancellationToken);

            return master;
        }
        private async Task<IEnumerable<dynamic>> GetPositionCode(CancellationToken cancellationToken)
        {
            StringBuilder sql = new StringBuilder();
            sql.AppendLine(@"select p.position_code as value,
                                        case when @lang = 'th' then p.position_name_th else p.position_name_en end as label
                                from db.position p
                                order by p.position_code"
            );
            return await _context.QueryAsync<dynamic>(sql.ToString(), new { lang = _user.Language }, cancellationToken);
        }
    }
}
