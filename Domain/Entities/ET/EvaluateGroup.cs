﻿using System.Collections.Generic;

namespace Domain.Entities.ET;

public class EvaluateGroup : EntityBase
{
    public string EvaluateGroupCode { get; set; }
    public string EvaluateGroupNameTh { get; set;}
    public string EvaluateGroupNameEn { get; set; }
    public int SequeneId { get; set; }
    public int? TotalPoint {  get; set; }
    public bool? Active { get; set; }
    public string RoleCode { get; set; }
    public ICollection<EvaluateDetail> EvaluateDetails { get; set; }
}
