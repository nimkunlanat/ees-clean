using System.Collections.Generic;

namespace Domain.Entities.ET;

public class EvaluateForm : EntityBase
{
    public string RoleCode { get; set; }
    public string RoleNameTh {  get; set; }
    public string RoleNameEn { get; set; }
    public string LanguageCode { get; set; }
    public bool Active { get; set; }
    public ICollection<EvaluateGroup> EvaluateGroups { get; set; }
}
