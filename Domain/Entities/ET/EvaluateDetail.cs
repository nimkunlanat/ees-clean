namespace Domain.Entities.ET;

public class EvaluateDetail : EntityBase 
{
    public string EvaluateGroupCode { get; set; }
    public string EvaluateDetailCode { get; set;}
    public string EvaluateDetailNameTh { get; set; }
    public string EvaluateDetailNameEn { get; set; }
    public int SequeneId { get; set; }
    public int Point { get; set; }
    public bool  Active { get; set; }
    public string LanuageCode { get; set; }
}