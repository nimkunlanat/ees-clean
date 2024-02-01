using Application.Interfaces;
using Domain.Entities.ET;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.ET
{
    public class List
    {
        public class Query : IRequest<List<DocumentApproved>>
        {
            public string Keywords { get; set; }
        }

        public class DocumentApproved
        {
            public int DbNumber { get; set; }
            public string EmployeeCode { get; set; }
            public bool Active { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<DocumentApproved>>
        {
            private readonly ICleanDbContext _context;
            private readonly ICurrentUserAccessor _user;

            public Handler(ICleanDbContext context, ICurrentUserAccessor user)
            {
                _context = context;
                _user = user;
            }

            public async Task<List<DocumentApproved>> Handle(Query request, CancellationToken cancellationToken)
            {
                StringBuilder sql = new StringBuilder();

                //sql.AppendLine(@"SELECT 
	               //                 user_id ""userId"", 
	               //                 firstname, 
	               //                 lastname,
                //                    firstname_th ""firstnameTh"",
                //                    lastname_th ""lastnameTh"",
	               //                 active
                //                FROM su.user
                //                where lower(concat(user_id,firstname,lastname, firstname_th, lastname_th)) ilike lower(concat('%',@Keywords,'%'))
                //                order by firstname, lastname");

                return await _context.QueryAsync<DocumentApproved>(sql.ToString(), new { request.Keywords }, cancellationToken) as List<DocumentApproved>;
            }
        }
    }
}