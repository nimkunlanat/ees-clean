using Application.Interfaces;
using Domain.Entities.ET;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.ET.ETDT02
{
    public class List
    {
        public class Query : IRequest<List<DocumentApprovedDTO>>
        {
            public string Keywords { get; set; }
            public string Assessment {  get; set; }
        }

        public class DocumentApprovedDTO : DocumentApproved
        {
            public string Name { get; set; }
            public string approverBy { get; set; }
            public string Status { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<DocumentApprovedDTO>>
        {
            private readonly ICleanDbContext _context;
            private readonly ICurrentUserAccessor _user;

            public Handler(ICleanDbContext context, ICurrentUserAccessor user)
            {
                _context = context;
                _user = user;
            }

            public async Task<List<DocumentApprovedDTO>> Handle(Query request, CancellationToken cancellationToken)
            {
                StringBuilder sql = new StringBuilder();
                sql.AppendLine(@"select  
                                        da.created_date ""createdDate"", 
                                        da.employee_code ""employeeCode"" ,
                                        case when @Lang = 'th' then concat(e.employee_firstname_th , ' ',e.employee_surname_th) else concat(e.employee_firstname_en , ' ',e.employee_surname_en) end ""name"",
                                        da.evaluation_status ""evaluationStatus"",
                                        case when @Lang = 'th' then s.desc_th else s.desc_en end ""Status"",
                                        case when @Lang = 'th' then concat(e2.employee_firstname_th , ' ',e2.employee_surname_th) else concat(e2.employee_firstname_en , ' ',e2.employee_surname_en) end ""approveBy""
                                        from et.document_approved da 
                                        left join db.status s on da.evaluation_status = s.id
                                        left join db.employee e on da.employee_code = e.employee_code
                                        left join tm.member_hierarchy mh on e.user_id = mh.user_id 
                                        left join db.employee e2 on da.approve_by = e2.employee_code
                                        where da.approve_by = (select e.employee_code from db.employee e where e.user_id = @UserId and da.created_date >='2025-05-01' AND da.created_date  <= '2025-07-31')");

                if (request.Keywords != null) sql.AppendLine(@"and concat(da.created_date, da.employee_code, e.employee_firstname_th, e.employee_surname_th, e.employee_firstname_en, e.employee_surname_en
                                                                , e2.employee_firstname_th, e2.employee_surname_th, e2.employee_firstname_en, e2.employee_surname_en) ilike concat('%',@Keywords,'%')");


                return await _context.QueryAsync<DocumentApprovedDTO>(sql.ToString(), new { Lang = _user.Language, request.Keywords, UserId = _user.UserId }, cancellationToken) as List<DocumentApprovedDTO>;
            }
        }
    }
}
