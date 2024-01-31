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

public class SaveSubdistrict
{
    public class Command : Subdistrict, ICommand<Subdistrict>
    {

    }

    public class Handler : IRequestHandler<Command, Subdistrict>
    {
        private readonly ICleanDbContext _context;
        public Handler(ICleanDbContext context, ICurrentUserAccessor user)
        {
            _context = context;
        }

        public async Task<Subdistrict> Handle(Command request, CancellationToken cancellationToken)
            {
            Validate(request);
            Subdistrict subdistrict = new Subdistrict();
            if (request.RowState == RowState.Add)
            {
                subdistrict = request;
                _context.Set<Subdistrict>().Add(subdistrict);
            }
            else if (request.RowState == RowState.Edit)
            {

                subdistrict = await _context.Set<Subdistrict>().Where(w => w.SubdistrictCode == request.SubdistrictCode).FirstOrDefaultAsync();
                subdistrict.SubdistrictTh = request.SubdistrictTh;
                subdistrict.SubdistrictEn = request.SubdistrictEn;
                subdistrict.PostalCode = request.PostalCode;
                subdistrict.Active = request.Active;
                subdistrict.Description = request.Description;
                _context.Set<Subdistrict>().Attach(subdistrict);
                _context.Entry(subdistrict).State = EntityState.Modified;
            }

            await _context.SaveChangesAsync(cancellationToken);

            return subdistrict;
        }

        private void Validate(Subdistrict subdistrict)
        {
            if (_context.Set<Subdistrict>().Any(a => (subdistrict.RowState == RowState.Add && a.SubdistrictCode == subdistrict.SubdistrictCode)))
                throw new RestException(HttpStatusCode.BadRequest, "message.STD00018");
        }
    }
}
