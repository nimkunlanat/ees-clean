using System;

namespace Domain.Entities.ET
{
    public class DocumentApproved : EntityBase
    {
            public string EmployeeCode { get; set; }
            public string EvaluationStatus { get; set; }
            public Guid DocumentNo { get; set; }
            public string ApproveBy { get; set; }
            public int Evaluated { get; set; }
            public int NotEvaluated { get; set; }

    }
}
