using GestionPlataformaConcierto.BC.Modelos;
using Microsoft.EntityFrameworkCore;

namespace GestionPlataformaConcierto.DA.Config
{
    public class GestionDePlataformaContext : DbContext
    {
        public GestionDePlataformaContext(DbContextOptions<GestionDePlataformaContext> options) : base(options) { }

        public DbSet<Usuario> Usuario { get; set; }
        public DbSet<Concierto> Concierto { get; set; }
        public DbSet<CategoriaAsiento> CategoriaAsiento { get; set; }
        public DbSet<ArchivoMultimedia> ArchivoMultimedia { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Relación CategoriaAsiento - Concierto
            modelBuilder.Entity<CategoriaAsiento>()
                .HasOne(ca => ca.Concierto)
                .WithMany(c => c.CategoriasAsiento)
                .HasForeignKey(ca => ca.ConciertoId)
                .OnDelete(DeleteBehavior.Cascade);

            // Relación ArchivoMultimedia - Concierto
            modelBuilder.Entity<ArchivoMultimedia>()
                .HasOne(am => am.Concierto)
                .WithMany(c => c.ArchivosMultimedia)
                .HasForeignKey(am => am.ConciertoId)
                .OnDelete(DeleteBehavior.Cascade);

            // Relación Concierto - Usuario (muchos conciertos por usuario)
            modelBuilder.Entity<Concierto>()
                .HasOne(c => c.Usuario)
                .WithMany(u => u.ConciertosCreados)
                .HasForeignKey(c => c.UsuarioID)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
