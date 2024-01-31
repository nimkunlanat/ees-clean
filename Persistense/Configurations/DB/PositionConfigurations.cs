using Domain.Entities.DB;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;


namespace Persistense.Configurations.DB
{
    public class PositionConfigurations : BaseConfiguration<Position>
    {
        public override void Configure(EntityTypeBuilder<Position> builder)
        {
            base.Configure(builder);
            builder.ToTable("position", "db");
            builder.HasKey(e => e.PositionCode);
        }
    }
}
