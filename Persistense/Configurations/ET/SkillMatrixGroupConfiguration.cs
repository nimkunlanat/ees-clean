using Domain.Entities.ET;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace Persistense.Configurations.ET;

public class SkillMatrixGroupConfiguration : BaseConfiguration<SkillMatrixGroup>
{
    public override void Configure(EntityTypeBuilder<SkillMatrixGroup> builder)
    {
        base.Configure(builder);
        builder.ToTable("skill_matrix_group", "et");
        builder.HasKey(e => e.GroupId);
        builder.HasMany(e => e.SkillMatrixSubjects).WithOne().HasForeignKey(o => o.GroupId).OnDelete(DeleteBehavior.Cascade);
    }
}
