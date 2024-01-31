using Application.Interfaces;
using Domain.Entities.DB;
using MediatR;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.DB.DBRT02;
public class Detail
{
    public class Query : IRequest<Employee>
    {
        public string EmployeeCode {  get; set; }
    }

    public class EmployeesDTO : Employee
    {
        public string UserName { get; set; }
    }
    public class Handler : IRequestHandler<Query, Employee>
    {
        private readonly ICleanDbContext _context;
        public Handler(ICleanDbContext context) => _context = context;
        public async Task<Employee> Handle(Query request, CancellationToken cancellationToken)
        {
            StringBuilder sql = new StringBuilder();
            sql.AppendLine(@"select e.employee_code ""employeeCode""
                                    , p.position_code ""positionCode""
                                    , e.phone_number ""phoneNumber""
                                    , e.email ""email"" 
                                    , e.employee_firstname_th ""employeeFirstnameTh""
                                    , e.employee_surname_th ""employeeSurnameTh""
                                    , e.employee_firstname_en ""employeeFirstnameEn""
                                    , e.employee_surname_en ""employeeSurnameEn""
	                                , e.gender ""gender""
                                    , e.date_of_birth ""dateOfBirth""
                                    , e.nationality ""nationality""
                                    , e.religion ""religion""
                                    , e.active ""active""
                                    , e.xmin ""rowVersion""
                                    from db.employee e 
                                    left join db.""position"" p  on e.position_code = p.position_code
                                    where e.employee_code= @EmployeeCode;");

            return await _context.QueryFirstOrDefaultAsync<Employee>(sql.ToString(), new { employeeCode = request.EmployeeCode }, cancellationToken);
        }
    }
}

