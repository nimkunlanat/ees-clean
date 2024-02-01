using System;

namespace Domain.Entities.ET;

public class EvaluationFormManagement : EntityBase
{
    public string EvaluateGroupCode { get; set; }
    public string EvaluateDetailNameTh { get; set;}
    public string EvaluateDetailNameEn { get; set; }
    public int SequeneId { get; set; }
    public int Point {  get; set; }
    public Boolean Active { get; set; }
    public string LanguageCode { get; set; }
}
