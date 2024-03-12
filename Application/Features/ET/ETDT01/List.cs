using Application.Interfaces;
using MediatR;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Threading;
using Domain.Entities.ET;
using System;

namespace Application.Features.ET.ETDT01;

public class List
{
    public class Query : IRequest<List<DocumentApprovedDTO>>
    {
    }
    public class DocumentApprovedDTO : DocumentApproved
    {
        public string employeeName { get; set; }
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

            sql.AppendLine(@"select da.document_no ""documentNo"",
                                da.created_date ""createdDate"",
                                da.employee_code ""employeeCode"",
                                case when @Lang = 'th' then concat(e.employee_firstname_th ,' ', e.employee_surname_th) 
                                else concat(e.employee_firstname_en ,' ', e.employee_surname_en) end ""employeeName"",
                                da.evaluation_status ""evaluationStatus"",
                                case when @Lang = 'th' then s.desc_th else s.desc_en end ""Status"",
                                case when @Lang = 'th' then concat(e2.employee_firstname_th , ' ',e2.employee_surname_th)
                                else concat(e2.employee_firstname_en , ' ',e2.employee_surname_en) end ""approveBy"",
                                da.xmin ""rowVersion""
                                from et.document_approved da 
                                left join db.status s on da.evaluation_status = s.id
                                left join db.employee e on da.employee_code = e.employee_code 
                                left join db.employee e2 on da.approve_by = e2.employee_code
                                left join su.user u on e.user_id  = u.user_id 
                                where e.user_id = @userId");

            sql.AppendLine("order by da.created_date desc");

            return await _context.QueryAsync<DocumentApprovedDTO>(sql.ToString(), new { userId = _user.UserId, Lang = _user.Language}, cancellationToken) as List<DocumentApprovedDTO>;
        }
    }
}

