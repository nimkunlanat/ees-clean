using Domain.Entities.DB;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Persistense.Configurations.DB
{
    public class DistrictConfigurations : BaseConfiguration<District>
    {
        public override void Configure(EntityTypeBuilder<District> builder)
        {
            base.Configure(builder);
            builder.ToTable("district", "db");
            builder.HasKey(e => e.DistrictCode);
            builder.HasMany(p => p.Subdistrict).WithOne().HasForeignKey(f => f.DistrictCode).OnDelete(DeleteBehavior.Cascade);
        }
    }
}
