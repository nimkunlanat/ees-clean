using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities.ET
{
    public class DocumentApprovedSkill : EntityBase
    {
        public Guid? DocumentNo { get; set; }
        public Guid? DocumentSkillNo { get; set; }
        public Guid? GradeId { get; set; }
        public string Description { get; set; }
        public string Grade { get; set;}
        public int? Score { get; set; }
        public string ExpectedGrade { get; set; }
    }
}
