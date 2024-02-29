using System;

namespace Domain.Entities.ET
{
    public class DocumentApprovedDetail : EntityBase
    {
        public Guid DocumentNo { get; set; }
        public string EvaluateGroupCode { get; set; }
        public string EvaluateDetailCode { get; set; }
        public int? Point { get; set; }
    }
}
