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


namespace Application.Features.ET.ETDT01;

public class Save
{
    public class Command : Position, ICommand<Position>
    {

    }
    public class Handler : IRequestHandler<Command, Position>
    {
        private readonly ICleanDbContext _context;
        public Handler(ICleanDbContext context)
        {
            _context = context;
        }

        public async Task<Position> Handle(Command request, CancellationToken cancellationToken)
        {
            Validate(request);
            Position position = new Position();

            if (request.RowState == RowState.Add)
            {
                _context.Set<Position>().Add(request);
            }
            else if (request.RowState == RowState.Edit)
            {
                position = await _context.Set<Position>().Where(w => w.PositionCode == request.PositionCode).FirstOrDefaultAsync();
                position.PositionNameTh = request.PositionNameTh;
                position.PositionNameEn = request.PositionNameEn;
                position.Description = request.Description;
                position.Active = request.Active;
                position.LanguageCode = request.LanguageCode;



                _context.Set<Position>().Attach(position);
                _context.Entry(position).State = EntityState.Modified;
            }

            await _context.SaveChangesAsync(cancellationToken);

            return request;
        }
        private void Validate(Position position)
        {
            if (_context.Set<Position>().Any(a => position.RowState == RowState.Add && a.PositionCode == position.PositionCode)) throw new RestException(HttpStatusCode.BadRequest, "message.STD00004", position.PositionCode);
        }
    }
}
