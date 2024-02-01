using Domain.Entities.ET;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Persistense.Configurations.ET;
public class EvaluationFormManagementConfigurations : BaseConfiguration<EvaluationFormManagement>
{
    public override void Configure(EntityTypeBuilder<EvaluationFormManagement> builder)
    {
        base.Configure(builder);
        builder.ToTable("evaluate_detail", "et");
        builder.HasKey(e => e.EvaluateGroupCode);
    }
}
