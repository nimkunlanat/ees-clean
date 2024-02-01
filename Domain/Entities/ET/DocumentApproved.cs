using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities.ET
{
    public class DocumentApproved : EntityBase
    {
            public int DbNumber { get; set; }
            public string EmployeeCode { get; set; }
            public Boolean Active { get; set; }
    }
}
