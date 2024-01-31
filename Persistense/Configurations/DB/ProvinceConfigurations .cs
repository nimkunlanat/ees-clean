using Domain.Entities.DB;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Persistense.Configurations.DB
{
    public class ProvinceConfigurations : BaseConfiguration<Province>
    {
        public override void Configure(EntityTypeBuilder<Province> builder)
        {
            base.Configure(builder);
            builder.ToTable("province", "db");
            builder.HasKey(e => e.ProvinceCode);
            builder.HasMany(p => p.Districts).WithOne().HasForeignKey(f => f.ProvinceCode).OnDelete(DeleteBehavior.Cascade);
        }
    }
}
