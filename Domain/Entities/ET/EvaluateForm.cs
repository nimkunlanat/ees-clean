using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities.ET;

public class EvaluationForm : EntityBase
{
    public string RoleCode { get; set; }
    public string RoleNameTh {  get; set; }
    public string RoleNameEn { get; set; }
    public string LanguageCode { get; set; }
    public bool Active { get; set; }
    public ICollection<EvaluateGroup> EvaluateGroups { get; set; }
}
