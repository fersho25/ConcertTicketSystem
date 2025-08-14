using GestionPlataformaConcierto.BC.Modelos;
using GestionPlataformaConcierto.DA.Config;
using Microsoft.EntityFrameworkCore;
using GestionPlataformaConcierto.BW.Interfaces.DA;

namespace GestionPlataformaConcierto.DA.Acciones
{
    public class GestionarReservaDA : IGestionarReservaDA
    {
        private readonly GestionDePlataformaContext _context;

        public GestionarReservaDA(GestionDePlataformaContext context)
        {
            _context = context;
        }

        public async Task<bool> actualizarReserva(int id, Reserva reserva)
        {
            var reservaExistente = await _context.Reserva
                .Include(r => r.Asientos)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (reservaExistente == null)
                return false;

            // Actualizar propiedades básicas de la reserva
            reservaExistente.Estado = reserva.Estado;
            reservaExistente.FechaHoraReserva = reserva.FechaHoraReserva;
            reservaExistente.FechaHoraExpiracion = reserva.FechaHoraExpiracion;
            reservaExistente.ConciertoId = reserva.ConciertoId;
            reservaExistente.UsuarioId = reserva.UsuarioId;

            if (reserva.Asientos != null)
            {
                // Eliminar los asientos que ya no están
                var asientosParaEliminar = reservaExistente.Asientos
                    .Where(a => !reserva.Asientos.Any(na => na.Id == a.Id))
                    .ToList();

                _context.AsientoReserva.RemoveRange(asientosParaEliminar);

                // Actualizar existentes o agregar nuevos
                foreach (var asiento in reserva.Asientos)
                {
                    var asientoExistente = reservaExistente.Asientos.FirstOrDefault(a => a.Id == asiento.Id);
                    if (asientoExistente != null)
                    {
                        asientoExistente.CategoriaAsientoId = asiento.CategoriaAsientoId;
                        asientoExistente.NumeroAsiento = asiento.NumeroAsiento;
                        asientoExistente.Precio = asiento.Precio;
                    }
                    else
                    {
                        reservaExistente.Asientos.Add(new AsientoReserva
                        {
                            CategoriaAsientoId = asiento.CategoriaAsientoId,
                            NumeroAsiento = asiento.NumeroAsiento,
                            Precio = asiento.Precio
                        });
                    }
                }
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> cambiarEstadoReserva(int id, string nuevoEstado)
        {
            var reserva = await _context.Reserva.FindAsync(id);
            if (reserva == null)
                return false;

            reserva.Estado = nuevoEstado;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> eliminarReserva(int id)
        {
            var reserva = await _context.Reserva
                .Include(r => r.Asientos)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (reserva == null)
                return false;

            _context.AsientoReserva.RemoveRange(reserva.Asientos);
            _context.Reserva.Remove(reserva);

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Reserva> obtenerReservaPorId(int id)
        {
            return await _context.Reserva
                .Include(r => r.Asientos)
                    .ThenInclude(a => a.CategoriaAsiento)
                .Include(r => r.Concierto)
                .Include(r => r.Usuario)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<List<Reserva>> obtenerReservas()
        {
            return await _context.Reserva
                .Include(r => r.Asientos)
                    .ThenInclude(a => a.CategoriaAsiento)
                .Include(r => r.Concierto)
                .Include(r => r.Usuario)
                .ToListAsync();
        }

        public async Task<List<Reserva>> obtenerReservasPorConcierto(int conciertoId)
        {
            return await _context.Reserva
                .Where(r => r.ConciertoId == conciertoId)
                .Include(r => r.Asientos)
                    .ThenInclude(a => a.CategoriaAsiento)
                .Include(r => r.Usuario)
                .ToListAsync();
        }

        public async Task<List<Reserva>> obtenerReservasPorEstado(string estado)
        {
            return await _context.Reserva
                .Where(r => r.Estado.ToUpper() == estado.ToUpper())
                .Include(r => r.Asientos)
                    .ThenInclude(a => a.CategoriaAsiento)
                .Include(r => r.Concierto)
                .Include(r => r.Usuario)
                .ToListAsync();
        }

        public async Task<List<Reserva>> obtenerReservasPorUsuario(int usuarioId)
        {
            return await _context.Reserva
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
                await _context.Reserva.AddAsync(reserva);
                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<List<AsientoReserva>> ObtenerAsientosPorConcierto(int conciertoId)
        {
            return await _context.AsientoReserva
                .Include(ar => ar.Reserva)
                .Include(ar => ar.CategoriaAsiento)
                .Where(ar => ar.Reserva.ConciertoId == conciertoId)
                .ToListAsync();
        }


    }
}
