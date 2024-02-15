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
        builder.HasKey(e => new { e.SubjectId, e.SubjectName, e.SubjectGroup });
    }
}
