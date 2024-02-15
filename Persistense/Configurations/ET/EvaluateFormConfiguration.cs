using Domain.Entities.ET;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Persistense.Configurations.ET;

public class EvaluateFormConfiguration : BaseConfiguration<EvaluationForm>
{
    public override void Configure(EntityTypeBuilder<EvaluationForm> builder)
    {
        base.Configure(builder);
        builder.ToTable("evaluate_form", "et");
        builder.HasKey(e => e.RoleCode);
    }
}
