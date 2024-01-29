using Application.Behaviors;
using Application.Exceptions;
using Application.Interfaces;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Threading.Tasks;
using System.Threading;
using System.Linq;
using Domain.Entities.DB;

namespace Application.Features.DB.DBRT01;

public class Save
{
    public class Command : Status, ICommand<Status>
    {

    }

    public class Handler : IRequestHandler<Command, Status>
    {
        private readonly ICleanDbContext _context;
        public Handler(ICleanDbContext context, ICurrentUserAccessor user)
        {
            _context = context;
        }

        public async Task<Status> Handle(Command request, CancellationToken cancellationToken)
            {
            Validate(request);

            if (request.RowState == RowState.Add)
            {

                _context.Set<Status>().Add(request);
            }
            else if (request.RowState == RowState.Edit)
            {
                _context.Set<Status>().Attach(request);
                _context.Entry(request).State = EntityState.Modified;
            }

            await _context.SaveChangesAsync(cancellationToken);

            return request;
        }

        private void Validate(Status status)
        {
            if (_context.Set<Status>().Any(a => status.RowState == RowState.Add && a.Id == status.Id)) throw new RestException(HttpStatusCode.BadRequest, "message.STD00004");
        }
    }
}
