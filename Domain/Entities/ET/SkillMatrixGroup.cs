using System;
using System.Collections.Generic;


namespace Domain.Entities.ET;

public class SkillMatrixGroup : EntityBase
{
    public Guid? GroupId { get; set; }
    public string GroupName { get; set; }
    public string Description { get; set; }
    public bool Active { get; set; }
    public ICollection<SkillMatrixSubject> SkillMatrixSubjects { get; set; }
}
