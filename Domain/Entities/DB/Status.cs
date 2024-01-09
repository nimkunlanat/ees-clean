using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities.DB
{
    public class Status : EntityBase
    {
    public Guid Id { get; set; }
    public string TableName { get; set; }
    public string ColumnName { get; set; }
    public string Code { get; set; }
    public string DescTH { get; set; }
    public string DescEN { get; set; }
    public int Seq { get; set; }
    public string Remark { get; set; }
    public bool Active { get; set; }
    public string BackgroundColor { get; set; }
    public string FontColor { get; set; }
    }
}
