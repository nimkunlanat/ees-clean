using Application.Behaviors;
using Application.Common.Constants;
using Application.Interfaces;
using Domain.Entities.SU;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Threading;
using System.Linq;

namespace Application.Features.SU.SURT02;

public class Edit
{
    public class Command : MenuDTO, ICommand<Response>
    {

    }

    public class MenuDTO : Domain.Entities.SU.Menu
    {
        public string MenuNameTH { get; set; }
        public string MenuNameEN { get; set; }
    }

    public class Response
    {
        public string MenuCode { get; set; }
    }

    public class Handler : IRequestHandler<Command, Response>
    {
        private readonly ICleanDbContext _context;
        public Handler(ICleanDbContext context) => _context = context;
        public async Task<Response> Handle(Command request, CancellationToken cancellationToken)
        {
            _context.Set<Domain.Entities.SU.Menu>().Attach((Domain.Entities.SU.Menu)request);
            _context.Entry((Domain.Entities.SU.Menu)request).State = EntityState.Modified;

            List<MenuLabel> menuLabels = await _context.Set<MenuLabel>().Where(w => w.MenuCode == request.MenuCode).ToListAsync();

            foreach (MenuLabel menuLabel in menuLabels)
            {
                menuLabel.MenuName = menuLabel.LanguageCode == Lang.TH ? request.MenuNameTH : request.MenuNameEN;
                _context.Set<MenuLabel>().Attach(menuLabel);
                _context.Entry(menuLabel).State = EntityState.Modified;
            }

            await _context.SaveChangesAsync(cancellationToken);

            return new Response { MenuCode = request.MenuCode };
        }
    }
}
