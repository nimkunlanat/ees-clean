using Domain.Entities.ET;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace Persistense.Configurations.ET;

public class EvaluateFormConfiguration : BaseConfiguration<EvaluateForm>
{
    public override void Configure(EntityTypeBuilder<EvaluateForm> builder)
    {
        base.Configure(builder);
        builder.ToTable("evaluate_form", "et");
        builder.HasKey(e => e.RoleCode);
        builder.HasMany(e => e.EvaluateGroups).WithOne().HasForeignKey(o => o.RoleCode).OnDelete(DeleteBehavior.Cascade);
    }
}
