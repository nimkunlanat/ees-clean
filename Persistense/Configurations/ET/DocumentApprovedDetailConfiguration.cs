using Domain.Entities.ET;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace Persistense.Configurations.ET
{
    public class DocumentApprovedDetailConfiguration : BaseConfiguration<DocumentApprovedDetail>
    {
        public override void Configure(EntityTypeBuilder<DocumentApprovedDetail> builder)
        {
            base.Configure(builder);
            builder.ToTable("document_approved_detail", "et");
            builder.HasKey(e => e.DocumentDetailNo);
        }
    }
}
