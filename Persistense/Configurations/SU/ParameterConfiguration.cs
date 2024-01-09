using Domain.Entities.SU;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Persistense.Configurations.SU
{
    public class ParameterConfiguration : BaseConfiguration<Parameter>
    {
        public override void Configure(EntityTypeBuilder<Parameter> builder)
        {
            base.Configure(builder);
            builder.ToTable("parameter", "su");
            builder.HasKey(e => new { e.ParameterGroupCode, e.ParameterCode });
        }
    }
}
