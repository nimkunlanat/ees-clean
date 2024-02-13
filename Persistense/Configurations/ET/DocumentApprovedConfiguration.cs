using Domain.Entities.ET;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Persistense.Configurations.ET
{
   public class DocumentApprovedConfigurations : BaseConfiguration<DocumentApproved>
    {
        public override void Configure(EntityTypeBuilder<DocumentApproved> builder)
        {
            base.Configure(builder);
            builder.ToTable("document_approved", "et");
            builder.HasKey(e => e.EmployeeCode);
        }
    }
}
