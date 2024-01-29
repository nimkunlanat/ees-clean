using Application.Behaviors;
using Application.Exceptions;
using Application.Interfaces;
using Domain.Entities;
using Domain.Entities.DB;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.DB.DBRT02;

public class Save
{
    public class Command : Employee, ICommand<Employee>
    {

    }
    public class EmployeesDTO : Employee
    {
        public string UserName { get; set; }
    }

    public class Handler : IRequestHandler<Command, Employee>
    {
        private readonly ICleanDbContext _context;
        public Handler(ICleanDbContext context)
        {
            _context = context;
        }

        public async Task<Employee> Handle(Command request, CancellationToken cancellationToken)
        {
            //Validate(request);
            Employee employee = new Employee();

            if (request.RowState == RowState.Add)
            {
                _context.Set<Employee>().Add(request);
            }
            else if (request.RowState == RowState.Edit)
            {
                employee = await _context.Set<Employee>().Where(w => w.EmployeeCode == request.EmployeeCode).FirstOrDefaultAsync();
                employee.EmployeeFirstnameTh = request.EmployeeFirstnameTh; 
                employee.EmployeeFirstnameEn = request.EmployeeFirstnameEn;
                employee.EmployeeSurnameEn = request.EmployeeSurnameEn;
                employee.EmployeeSurnameTh = request.EmployeeSurnameTh;
                employee.PositionCode = request.PositionCode;
                employee.Gender = request.Gender;
                employee.DateOfBirth = request.DateOfBirth;
                employee.Nationality = request.Nationality;
                employee.Religion = request.Religion;
                employee.PhoneNumber = request.PhoneNumber;
                employee.Email = request.Email;
                employee.SequeneId = request.SequeneId;
                employee.LanguageCode = request.LanguageCode;   
                employee.Active = request.Active;


                _context.Set<Employee>().Attach(employee);
                _context.Entry(employee).State = EntityState.Modified;
            }

            await _context.SaveChangesAsync(cancellationToken);

            return request;
        }

        private void Validate(Employee employee)
        {
            if (_context.Set<Employee>().Any(a => employee.RowState == RowState.Add && a.EmployeeCode == employee.EmployeeCode)) throw new RestException(HttpStatusCode.BadRequest, "message.STD00004", employee.EmployeeCode);
        }
    }
}