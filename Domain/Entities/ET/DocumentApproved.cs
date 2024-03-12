using System;
using System.Collections.Generic;

namespace Domain.Entities.ET
{
    public class DocumentApproved : EntityBase
    {
        public string EmployeeCode { get; set; }
        public Guid? EvaluationStatus { get; set; }
        public Guid? DocumentNo { get; set; }
        public string ApproveBy { get; set; }
        public ICollection<DocumentApprovedDetail> DocumentApprovedDetails { get; set; }
        public ICollection<DocumentApprovedSkill> DocumentApprovedSkills { get; set; }
    }
}
