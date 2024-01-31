using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities.DB
{
    public class District : EntityBase
    {
        public Guid? DistrictCode { get; set; }
        public Guid? ProvinceCode { get; set; }
        public string DistrictTh {  get; set; }
        public string DistrictEn { get; set;}
        public bool? Active { get; set; }
        public string Description { get; set; }
        public ICollection<Subdistrict> Subdistrict { get; set;}
    }
}
