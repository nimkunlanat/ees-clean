using Application.Behaviors;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.DB.DBRT02;

public class Delete
{
    public class Command : ICommand
    {
        public string EmployeeCode { get; set; }

    }

    public class Handler : IRequestHandler<Command, Unit>
    {
        private readonly ICleanDbContext _context;
        public Handler(ICleanDbContext context) => _context = context;
        public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
        {
            Domain.Entities.DB.Employee employee = await _context.Set<Domain.Entities.DB.Employee>().Where(w => w.EmployeeCode == request.EmployeeCode).FirstOrDefaultAsync();
            _context.Set<Domain.Entities.DB.Employee>().RemoveRange(employee);
            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
