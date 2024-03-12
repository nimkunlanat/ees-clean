using Domain.Entities.ET;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Persistense.Configurations.ET;

public class SkillMatrixGradeConfiguration : BaseConfiguration<SkillMatrixGrade>
{
    public override void Configure(EntityTypeBuilder<SkillMatrixGrade> builder)
    {
        base.Configure(builder);
        builder.ToTable("skill_matrix_grade", "et");
        builder.HasKey(e => e.GradeId);
        builder.Property(e => e.GradeId).ValueGeneratedOnAdd();
    }
}
