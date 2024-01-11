using Domain.Entities.DB;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;


namespace Persistense.Configurations.DB
{
    public class StatusConfigurations : BaseConfiguration<Status>
    {
        public override void Configure(EntityTypeBuilder<Status> builder)
        {
            base.Configure(builder);
            builder.ToTable("status", "db");
            builder.HasKey(e => e.Id );
        }
    }
}
