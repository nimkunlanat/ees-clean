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

namespace Application.Features.DB.DBRT04;

public class Save
{
    public class Command : Province, ICommand<Province>
    {

    }

    public class Handler : IRequestHandler<Command, Province>
    {
        private readonly ICleanDbContext _context;
        public Handler(ICleanDbContext context, ICurrentUserAccessor user)
        {
            _context = context;
        }

        public async Task<Province> Handle(Command request, CancellationToken cancellationToken)
            {
            Validate(request);

            if (request.RowState == RowState.Add)
            {

                _context.Set<Province>().Add(request);
            }
            else if (request.RowState == RowState.Edit)
            {
                _context.Set<Province>().Attach(request);
                _context.Entry(request).State = EntityState.Modified;
            }

            await _context.SaveChangesAsync(cancellationToken);

            return request;
        }

        private void Validate(Province province)
        {
            if (_context.Set<Province>().Any(a => province.RowState == RowState.Add && a.ProvinceCode == province.ProvinceCode)) throw new RestException(HttpStatusCode.BadRequest, "message.STD00004", province.ProvinceTh);
        }
    }
}
