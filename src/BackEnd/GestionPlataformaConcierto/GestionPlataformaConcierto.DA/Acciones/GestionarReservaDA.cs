using GestionPlataformaConcierto.BC.Modelos;
using GestionPlataformaConcierto.BC.Interfaces.DA;
using GestionPlataformaConcierto.DA.Config;
using Microsoft.EntityFrameworkCore;

namespace GestionPlataformaConcierto.DA.Acciones
{
    public class GestionarReservaDA : IGestionarReservaDA
    {
        private readonly GestionDePlataformaContext gestionDePlataformaContext;

        public GestionarReservaDA(GestionDePlataformaContext gestionDePlataformaContext)
        {
            this.gestionDePlataformaContext = gestionDePlataformaContext;
        }

        public async Task<bool> actualizarReserva(int id, Reserva reserva)
        {
            var reservaExistente = await gestionDePlataformaContext.Reserva
                .Include(r => r.Asientos)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (reservaExistente == null)
                return false;

            // Actualizar propiedades básicas de la reserva
            reservaExistente.Estado = reserva.Estado;
            reservaExistente.FechaHoraReserva = reserva.FechaHoraReserva;
            reservaExistente.ConciertoId = reserva.ConciertoId;
            reservaExistente.UsuarioId = reserva.UsuarioId;
            // ... otras propiedades si las hay

            if (reserva.Asientos != null)
            {
                // Eliminar los asientos que ya no están en la nueva lista
                var asientosParaEliminar = reservaExistente.Asientos
                    .Where(a => !reserva.Asientos.Any(na => na.Id == a.Id))
                    .ToList();

                gestionDePlataformaContext.AsientoReserva.RemoveRange(asientosParaEliminar);

                // Actualizar asientos existentes y agregar nuevos
                foreach (var asiento in reserva.Asientos)
                {
                    var asientoExistente = reservaExistente.Asientos.FirstOrDefault(a => a.Id == asiento.Id);
                    if (asientoExistente != null)
                    {
                        // Actualizar asiento existente
                        asientoExistente.CategoriaAsientoId = asiento.CategoriaAsientoId;
                        asientoExistente.NumeroAsiento = asiento.NumeroAsiento;
                        asientoExistente.Precio = asiento.Precio;
                    }
                    else
                    {
                        // Nuevo asiento, añadir a la colección de la reserva
                        reservaExistente.Asientos.Add(new AsientoReserva
                        {
                            CategoriaAsientoId = asiento.CategoriaAsientoId,
                            NumeroAsiento = asiento.NumeroAsiento,
                            Precio = asiento.Precio
                        });
                    }
                }
            }

            await gestionDePlataformaContext.SaveChangesAsync();
            return true;
        }


        public async Task<bool> cambiarEstadoReserva(int id, string nuevoEstado)
        {
            var reserva = await gestionDePlataformaContext.Reserva.FindAsync(id);
            if (reserva == null)
                return false;

            reserva.Estado = nuevoEstado;
            await gestionDePlataformaContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> eliminarReserva(int id)
        {
            var reserva = await gestionDePlataformaContext.Reserva
                .Include(r => r.Asientos)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (reserva == null)
                return false;

            gestionDePlataformaContext.AsientoReserva.RemoveRange(reserva.Asientos);
            gestionDePlataformaContext.Reserva.Remove(reserva);

            await gestionDePlataformaContext.SaveChangesAsync();
            return true;
        }

        public async Task<Reserva> obtenerReservaPorId(int id)
        {
            return await gestionDePlataformaContext.Reserva
               .Include(r => r.Asientos)
                   .ThenInclude(a => a.CategoriaAsiento)
               .Include(r => r.Concierto)
               .Include(r => r.Usuario)
               .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<List<Reserva>> obtenerReservas()
        {
            return await gestionDePlataformaContext.Reserva
                .Include(r => r.Asientos)
                    .ThenInclude(a => a.CategoriaAsiento)
                .Include(r => r.Concierto)
                .Include(r => r.Usuario)
                .ToListAsync();
        }

        public async Task<List<Reserva>> obtenerReservasPorConcierto(int conciertoId)
        {
            return await gestionDePlataformaContext.Reserva
                .Where(r => r.ConciertoId == conciertoId)
                .Include(r => r.Asientos)
                    .ThenInclude(a => a.CategoriaAsiento)
                .Include(r => r.Usuario)
                .ToListAsync();
        }

        public async Task<List<Reserva>> obtenerReservasPorEstado(string estado)
        {
            return await gestionDePlataformaContext.Reserva
              .Where(r => r.Estado.ToUpper() == estado.ToUpper())
              .Include(r => r.Asientos)
                  .ThenInclude(a => a.CategoriaAsiento)
              .Include(r => r.Concierto)
              .Include(r => r.Usuario)
              .ToListAsync();
        }

        public async Task<List<Reserva>> obtenerReservasPorUsuario(int usuarioId)
        {
            return await gestionDePlataformaContext.Reserva
               .Where(r => r.UsuarioId == usuarioId)
               .Include(r => r.Asientos)
                   .ThenInclude(a => a.CategoriaAsiento)
               .Include(r => r.Concierto)
               .ToListAsync();
        }

        public async Task<bool> registrarReserva(Reserva reserva)
        {
            try
            {
                await gestionDePlataformaContext.Reserva.AddAsync(reserva);
                await gestionDePlataformaContext.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }

            public async Task<List<AsientoReserva>> ObtenerAsientosPorConcierto(int conciertoId)
        {
            return await gestionDePlataformaContext.AsientoReserva
                .Include(ar => ar.Reserva)
                .Include(ar => ar.CategoriaAsiento)
                .Where(ar => ar.Reserva.ConciertoId == conciertoId)
                .ToListAsync();
        }
    }
}

