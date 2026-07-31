using Microsoft.EntityFrameworkCore;

namespace Data;

public class AppDbContext : DbContext
{
  public DbSet<ModelOne> ModelOne => Set<ModelOne>();
  public DbSet<ModelTwo> ModelTwo => Set<ModelTwo>();

  public AppDbContext(DbContextOptions<AppDbContext> options) { }

  protected virtual void OnModelCreating(ModelBuilder builder)
  {
    base.OnModelCreating(builder);

    builder.Entity<ModelOne>(entity =>
    {
      entity.HasKey(x => x.Id);

      entity.Property(x => x.FirstName)
        .IsRequired();

      entity.HasOne<ModelTwo>()
        .WithMany(x => x.ModelTwo)
        .HasForeignKey(x => x.ModelTwoId);
    });
  }
}

