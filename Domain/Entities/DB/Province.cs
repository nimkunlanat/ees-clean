using System;
using System.Collections.Generic;

namespace Domain.Entities.DB
{
    public class Province : EntityBase
    {
        public Guid? ProvinceCode { get; set; }
        public string ProvinceTh { get; set; }
        public string ProvinceEn { get; set; }
        public bool? Active { get; set; }
        public string Description { get; set; }
        public ICollection<District> Districts { get; set; }

    }
}
