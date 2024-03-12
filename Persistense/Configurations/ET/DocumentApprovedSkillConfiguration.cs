using Domain.Entities.DB;
using Domain.Entities.ET;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Persistense.Configurations.ET
{
    public class DocumentApprovedSkillConfiguration : BaseConfiguration<DocumentApprovedSkill>
    {
        public override void Configure(EntityTypeBuilder<DocumentApprovedSkill> builder)
        {
            base.Configure(builder);
            builder.ToTable("document_approved_skill", "et");
            builder.HasKey(e => e.DocumentSkillNo);
        }
    }
}
