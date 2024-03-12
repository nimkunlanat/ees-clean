using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Security;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities.ET;

public class SkillMatrixGrade : EntityBase
{
    public Guid? GradeId { get; set; }
    public Guid? SubjectId { get; set; }
    public string Grade {  get; set; }
    public int? Score { get; set; }
    public string Description { get; set; }
    public string Example { get; set; }
    public int? ContentID { get; set; }
    public int? ExpectedScore { get; set; }
    public bool? Active { get; set; }    

}
