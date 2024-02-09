using Domain.Entities.ET;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Persistense.Configurations.ET;
public class EvaluateGroupConfigurations : BaseConfiguration<EvaluateGroup>
{
    public override void Configure(EntityTypeBuilder<EvaluateGroup> builder)
    {
        base.Configure(builder);
        builder.ToTable("evaluate_group", "et");
        builder.HasKey(e => e.EvaluateGroupCode);
        builder.HasMany(e => e.EvaluateDetails).WithOne().HasForeignKey(o => o.EvaluateGroupCode).OnDelete(DeleteBehavior.Cascade);
    }
}
