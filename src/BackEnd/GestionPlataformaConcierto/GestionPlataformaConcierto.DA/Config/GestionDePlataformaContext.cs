using GestionPlataformaConcierto.BC.Modelos;
using GestionPlataformaConcierto.DA.Entidades;
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
        public DbSet<Venta> Venta { get; set; }
        public DbSet<Compra> Compra { get; set; }

        public DbSet<Promocion> Promocion { get; set; }

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


            // Relación Venta - Concierto
            modelBuilder.Entity<Venta>()
                .HasOne(v => v.Concierto)
                .WithOne(c => c.Venta) 
                .HasForeignKey<Venta>(v => v.ConciertoId)
                .OnDelete(DeleteBehavior.Cascade);

            // AsientoReserva - Compra
            modelBuilder.Entity<AsientoReserva>()
                .HasOne(ar => ar.Compra)
                .WithMany(c => c.Asientos)
                .HasForeignKey(ar => ar.CompraId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Compra>()
    .HasOne(c => c.Reserva)
    .WithOne(r => r.Compra)
    .HasForeignKey<Compra>(c => c.ReservaId) 
    .OnDelete(DeleteBehavior.Cascade);


            
            modelBuilder.Entity<Promocion>()
                .HasOne(p => p.Concierto)
                .WithMany(c => c.Promociones)
                .HasForeignKey(p => p.ConciertoId)
                .OnDelete(DeleteBehavior.Cascade);



        }
    }
}

