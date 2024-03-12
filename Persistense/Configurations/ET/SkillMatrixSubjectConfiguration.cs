using Domain.Entities.ET;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Persistense.Configurations.ET;

public class SkillMatrixSubjectConfiguration : BaseConfiguration<SkillMatrixSubject>
{
    public override void Configure(EntityTypeBuilder<SkillMatrixSubject> builder)
    {
        base.Configure(builder);
        builder.ToTable("skill_matrix_subject", "et");
        builder.Property(e => e.SubjectId).ValueGeneratedOnAdd();
        builder.HasKey(e => new { e.SubjectId });
        builder.HasMany(e => e.SkillMatrixGrades).WithOne().HasForeignKey(o => o.SubjectId).OnDelete(DeleteBehavior.Cascade);
    }
}
