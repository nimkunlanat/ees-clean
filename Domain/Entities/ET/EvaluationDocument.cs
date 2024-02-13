

using System;

namespace Domain.Entities.ET
{
    public class EvaluationDocument : EntityBase
    {
        public Guid? DocumentNo { get; set; }
        public string EvaluateGroupCode { get; set; }
        public string EvaluateDetailCode { get; set; }
        public int? Point { get; set; }
    }
}
