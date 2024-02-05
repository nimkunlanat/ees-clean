using Application.Interfaces;
using Domain.Entities.ET;
using Microsoft.EntityFrameworkCore;

namespace Persistense;

public partial class CleanDbContext : DbContext, ICleanDbContext
{
    public DbSet<EvaluateGroup> EvaluationGroup { get; set; }
    public DbSet<EvaluateDetail> EvaluateDetails { get; set; }
}
