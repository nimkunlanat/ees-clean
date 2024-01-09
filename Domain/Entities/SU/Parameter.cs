using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities.SU
{
    public class Parameter : EntityBase 
    {
        public string ParameterGroupCode { get; set; }  
        public string ParameterCode{ get; set;}
        public string ParameterValue { get; set; }
        public string Remark { get; set; }
    }
}
