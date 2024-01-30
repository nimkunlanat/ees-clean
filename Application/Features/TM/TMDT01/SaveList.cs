using Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.TM.TMDT01
{
    public class SaveList
    {
        public class Query : IRequest<List<UserDTO>>
        {
            public string Keywords { get; set; }
        }
        public class UserDTO
        {
            public string PositionNameEn { get; set; }
            public int UserId { get; set; }
            public string FirstnameTh { get; set; }
            public string LastnameTh { get; set; }
            public int? HeadUser {  get; set; }

        }
        public class Handler : IRequestHandler<Query, List<UserDTO>>
        {
            private readonly ICleanDbContext _context;
            private readonly ICurrentUserAccessor _user;

            public Handler(ICleanDbContext context, ICurrentUserAccessor user)
            {
                _context = context;
                _user = user;
            }

            public async Task<List<UserDTO>> Handle(Query request, CancellationToken cancellationToken)
            {
                StringBuilder sql = new StringBuilder();
                sql.AppendLine(@"
                              select      tm.user_id ""userId"", u.firstname_th ""firstnameTh"", u.lastname_th ""lastnameTh"" , p.position_name_en ""positionNameEn"", tm.head_user ""headUser"" 
                            from tm.""member_hierarchy"" tm 
                                left join su.""user"" u on tm.user_id = u.user_id 
                                left join db.""position"" p on p.position_code = (
	                                select e.position_code from db.employee e
	                                where e.user_id = tm.user_id 
                                )");
                return await _context.QueryAsync<UserDTO>(sql.ToString(), new { Lang = _user.Language, request.Keywords }, cancellationToken) as List<UserDTO>;
            }
        }
    }
}
