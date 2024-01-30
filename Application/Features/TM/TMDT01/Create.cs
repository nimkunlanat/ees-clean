using Application.Behaviors;
using Application.Interfaces;
using Domain.Entities;
using Domain.Entities.SU;
using Domain.Entities.TM;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.TM.TMDT01
{
    public class Create
    {
        public class Command : List<MemberHierarchy>, ICommand<Unit>
        {

        }

        public class Handler : IRequestHandler<Command, Unit>
        {
            private readonly ICleanDbContext _context;
            public Handler(ICleanDbContext context, ICurrentUserAccessor user)
            {
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                List<MemberHierarchy> users = _context.Set<MemberHierarchy>().ToList();
                _context.Set<MemberHierarchy>().RemoveRange(users);
                await _context.SaveChangesAsync(cancellationToken);

                List<MemberHierarchy> addUsers = new List<MemberHierarchy>();

                foreach (MemberHierarchy user in request)
                {
                    user.RowState = RowState.Add;
                    addUsers.Add(user);
                }

                _context.Set<MemberHierarchy>().AddRange(addUsers);

                await _context.SaveChangesAsync(cancellationToken);
                return Unit.Value;
            }

            public string severalValueStr(string str)
            {
                string[] List = str.Split(",");
                List<string> list = new List<string>(List);

                for (int i = 0; i < list.Count; i++)
                {
                    if (string.IsNullOrEmpty(list[i])) list.RemoveAt(i);
                }

                string[] m = new string[list.Count];
                for (int k = 0; k < list.Count; k++)
                {
                    if (!string.IsNullOrEmpty(list[k])) m[k] = "'" + list[k] + "'";
                }

                var result = string.Join(",", m);
                return result;
            }


        }
    }


}
