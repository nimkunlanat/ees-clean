using Application.Interfaces;
using Domain.Entities.DB;
using Microsoft.EntityFrameworkCore;


namespace Persistense;

public partial class CleanDbContext : DbContext, ICleanDbContext
{
    public DbSet<Status> Status { get; set; }
    public DbSet<Employee> Employees { get; set; }
}
