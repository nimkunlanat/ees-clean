using System;

namespace Domain.Entities.ET
{
    public class DocumentApprovedDetail : EntityBase
    {
        public Guid? DocumentNo { get; set; }
        public Guid? DocumentDetailNo { get; set; }
        public string EvaluateDetailCode { get; set; }
        public float? Point { get; set; }
    }
}
