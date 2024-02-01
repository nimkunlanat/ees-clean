using Application.Interfaces;
using Domain.Entities.DB;
using MediatR;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.DB.DBRT02;

public class List
{
    public class Query : IRequest<List<EmployeesDTO>>
    {
        public string Keywords { get; set; }
    }
     public class EmployeesDTO: Employee
     {
        public string PositionName { get; set; }
        public string EmployeeName { get; set; }
        public string UserName { get; set; }
     }
    public class Handler : IRequestHandler<Query, List<EmployeesDTO>>
    {
        private readonly ICleanDbContext _context;
        private readonly ICurrentUserAccessor _user;

        public Handler(ICleanDbContext context, ICurrentUserAccessor user)
        {
            _context = context;
            _user = user;
        }

        public async Task<List<EmployeesDTO>> Handle(Query request, CancellationToken cancellationToken)
        {
            StringBuilder sql = new StringBuilder();

            sql.AppendLine(@"select e.employee_code ""employeeCode""
                                , s.user_name ""userName""
                                , case when @Lang = 'th' then p.position_name_th else p.position_name_en end as ""positionName""
                                , e.team_code ""teamCode""
                                , e.phone_number ""phoneNumber""
                                , e.email ""email""
                                , CONCAT(
                                        CASE WHEN @Lang = 'th' THEN employee_firstname_th ELSE employee_firstname_en END,
                                        ' ',
                                        CASE WHEN @Lang = 'th' THEN employee_surname_th ELSE employee_surname_en END
                                    ) AS employeeName
                                , gender ""gender""
                                , e.date_of_birth ""dateOfBirth""
                                , nationality ""nationality""
                                , religion ""religion""
                                , e.xmin ""rowVersion""
                                , e.active ""active""
                                from db.employee e
                                left join su.""user"" s on e.user_id = s.user_id
                                inner  join db.""position"" p on e.position_code = p.position_code
                                where 1 = 1");

            if (request.Keywords != null) sql.AppendLine(@"and concat(e.employee_code, s.user_name, p.position_name_th, p.position_name_en, e.employee_firstname_th, e.employee_firstname_en, e.employee_surname_th, e.employee_surname_en) ilike concat('%',@Keywords,'%')");

            sql.AppendLine("order by e.employee_code");

            return await _context.QueryAsync<EmployeesDTO>(sql.ToString(), new { Lang = _user.Language, request.Keywords }, cancellationToken) as List<EmployeesDTO>;
        }
    }
}
