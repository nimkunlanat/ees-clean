using System;
using System.Collections.Generic;

namespace Domain.Entities.ET;

public class EvaluateGroup : EntityBase
{
    public string EvaluateGroupCode { get; set; }
    public string EvaluateGroupNameTh { get; set;}
    public string EvaluateGroupNameEn { get; set; }
    public int? SequeneId { get; set; }
    public int? TotalPoint {  get; set; }
    public Boolean Active { get; set; }
    public ICollection<EvaluateDetail> EvaluationDetails { get; set; }
}
