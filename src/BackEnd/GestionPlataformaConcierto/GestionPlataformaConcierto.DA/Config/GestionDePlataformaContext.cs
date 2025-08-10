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
        public DbSet<Reserva> Reserva { get; set; }
        public DbSet<AsientoReserva> AsientoReserva { get; set; }

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

            // Relación Reserva - Usuario
            modelBuilder.Entity<Reserva>()
                .HasOne(r => r.Usuario)
                .WithMany(u => u.Reservas)
                .HasForeignKey(r => r.UsuarioId)
                .OnDelete(DeleteBehavior.Restrict);

            // Relación Reserva - Concierto
            modelBuilder.Entity<Reserva>()
                .HasOne(r => r.Concierto)
                .WithMany(c => c.Reservas)
                .HasForeignKey(r => r.ConciertoId)
                .OnDelete(DeleteBehavior.Cascade);

            // Relación AsientoReserva - Reserva
            modelBuilder.Entity<AsientoReserva>()
                .HasOne(ar => ar.Reserva)
                .WithMany(r => r.Asientos)
                .HasForeignKey(ar => ar.ReservaId)
                .OnDelete(DeleteBehavior.Cascade);

            // Relación AsientoReserva - CategoriaAsiento
            modelBuilder.Entity<AsientoReserva>()
                .HasOne(ar => ar.CategoriaAsiento)
                .WithMany()
                .HasForeignKey(ar => ar.CategoriaAsientoId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
