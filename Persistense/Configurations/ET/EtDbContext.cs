using Application.Interfaces;
using Domain.Entities.ET;
using Microsoft.EntityFrameworkCore;

namespace Persistense;

public partial class CleanDbContext : DbContext, ICleanDbContext
{
    public DbSet<EvaluateGroup> EvaluationGroups { get; set; }
    public DbSet<EvaluateDetail> EvaluateDetails { get; set; }
    public DbSet<DocumentApproved> DocumentApproveds { get; set; }
    public DbSet<DocumentApprovedDetail> DocumentApprovedDetails { get; set; }
    public DbSet<DocumentApprovedSkill> DocumentApprovedSkills { get; set; }
    public DbSet<SkillMatrixGroup> SkillMatrixGroups { get; set; }
    public DbSet<SkillMatrixSubject> SkillMatrixSubjects { get; set; }
    public DbSet<EvaluateForm> EvaluateForms { get; set; }
}
