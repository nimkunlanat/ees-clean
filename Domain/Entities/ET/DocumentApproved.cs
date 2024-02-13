using System;
using System.Collections.Generic;

namespace Domain.Entities.ET
{
    public class DocumentApproved : EntityBase
    {
        public string EmployeeCode { get; set; }
        public string EvaluationStatus { get; set; }
        public Guid? DocumentNo { get; set; }
        public string ApproveBy { get; set; }
        public ICollection<EvaluationDocument> EvaluationDocuments { get; set; }
    }
}
