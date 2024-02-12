using Application.Interfaces;
using Domain.Entities.ET;
using Microsoft.EntityFrameworkCore;

namespace Persistense;

    public partial class CleanDbContext : DbContext, ICleanDbContext
    {
        public DbSet<DocumentApproved> DocumentApproveds { get; set; }
    }

