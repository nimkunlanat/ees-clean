using System;

namespace Domain.Entities.DB
{
    public class Subdistrict : EntityBase
    {
        public Guid? SubdistrictCode { get; set; }
        public Guid? DistrictCode {  get; set; }
        public string SubdistrictTh {  get; set; }
        public string SubdistrictEn { get; set; }
        public string PostalCode { get; set; }
        public bool? Active { get; set; }
        public string Description { get; set; }
    }
}
