using System;

namespace Domain.Entities.ET;

public class SkillMatrixSubject : EntityBase
{
    public Guid SubjectId { get; set; }
    public Guid GroupId { get; set; }
    public string SubjectGroup { get; set; }
    public string SubjectName { get; set; }
    public string Description { get; set; }
    public bool Active {  get; set; }
}
