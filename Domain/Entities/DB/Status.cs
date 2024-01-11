using System;

namespace Domain.Entities.DB;
public class Status : EntityBase
{
    public Guid? Id { get; set; }
    public string TableName { get; set; }
    public string ColumnName { get; set; }
    public string Code { get; set; }
    public string DescTh { get; set; }
    public string DescEn { get; set; }
    public int Seq { get; set; }
    public string Remark { get; set; }
    public bool? Active { get; set; }
    public string BackgroundColor { get; set; }
    public string FontColor { get; set; }
}
