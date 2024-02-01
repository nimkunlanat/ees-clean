using Domain.Entities.DB;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Persistense.Configurations.DB
{
    public class SubdistrictConfigurations : BaseConfiguration<Subdistrict>
    {
        public override void Configure(EntityTypeBuilder<Subdistrict> builder)
        {
            base.Configure(builder);
            builder.ToTable("subdistrict", "db");
            builder.HasKey(e => e.SubdistrictCode);
        }
    }
}
