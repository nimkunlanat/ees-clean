using System;
using System.Collections.Generic;

namespace Domain.Entities.ET;

public class SkillMatrixSubject : EntityBase
{
    public Guid? SubjectId { get; set; }
    public Guid? GroupId { get; set; }
    public string SubjectGroup { get; set; }
    public string SubjectName { get; set; }
    public string Description { get; set; }
    public string ExpectedGrade { get; set; }
    public bool? Active {  get; set; }
    public ICollection<SkillMatrixGrade> SkillMatrixGrades { get; set; }
}
