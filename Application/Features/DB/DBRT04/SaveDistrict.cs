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

public class SaveDistrict
{
    public class Command : District, ICommand<District>
    {

    }

    public class Handler : IRequestHandler<Command, District>
    {
        private readonly ICleanDbContext _context;
        public Handler(ICleanDbContext context, ICurrentUserAccessor user)
        {
            _context = context;
        }

        public async Task<District> Handle(Command request, CancellationToken cancellationToken)
            {
            Validate(request);
            if (request.RowState == RowState.Add)
            {
                
                _context.Set<District>().Add(request);
            }
            else if (request.RowState == RowState.Edit)
            {
                _context.Set<District>().Attach(request);
                _context.Entry(request).State = EntityState.Modified;
            }

            await _context.SaveChangesAsync(cancellationToken);

            return request;
        }

        private void Validate(District district)
        {
            if (_context.Set<District>().Any(a => (district.RowState == RowState.Add && a.DistrictCode == district.DistrictCode)
            || a.DistrictTh == district.DistrictTh 
            || a.DistrictEn == district.DistrictEn))
                throw new RestException(HttpStatusCode.BadRequest, "message.STD00018");
        }
    }
}
