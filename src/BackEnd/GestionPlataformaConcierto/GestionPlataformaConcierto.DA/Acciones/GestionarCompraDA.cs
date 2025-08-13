using GestionPlataformaConcierto.BC.Modelos;
using GestionPlataformaConcierto.DA.Config;
using Microsoft.EntityFrameworkCore;
using GestionPlataformaConcierto.BW.Interfaces.DA;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GestionPlataformaConcierto.DA.Acciones
{
    public class GestionarCompraDA : IGestionarCompraDA
    {
        private readonly GestionDePlataformaContext _context;

        public GestionarCompraDA(GestionDePlataformaContext context)
        {
            _context = context;
        }

        public async Task<bool> registrarCompra(Compra compra)
        {
            try
            {
                await _context.Set<Compra>().AddAsync(compra);
                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> actualizarCompra(int id, Compra compra)
        {
            var compraExistente = await _context.Set<Compra>()
                .Include(c => c.Asientos)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (compraExistente == null)
                return false;

            compraExistente.MetodoPago = compra.MetodoPago;
            compraExistente.FechaHoraCompra = compra.FechaHoraCompra;
            compraExistente.PrecioTotal = compra.PrecioTotal;
            compraExistente.DescuentoAplicado = compra.DescuentoAplicado;
            compraExistente.PromocionAplicada = compra.PromocionAplicada;
            compraExistente.CodigoQR = compra.CodigoQR;
            compraExistente.Notificado = compra.Notificado;
            compraExistente.Estado = compra.Estado;

            if (compra.Asientos != null)
            {
                var asientosParaEliminar = compraExistente.Asientos
                    .Where(a => !compra.Asientos.Any(na => na.Id == a.Id))
                    .ToList();
                _context.Set<AsientoReserva>().RemoveRange(asientosParaEliminar);

                foreach (var asiento in compra.Asientos)
                {
                    var asientoExistente = compraExistente.Asientos.FirstOrDefault(a => a.Id == asiento.Id);
                    if (asientoExistente != null)
                    {
                        asientoExistente.CategoriaAsientoId = asiento.CategoriaAsientoId;
                        asientoExistente.NumeroAsiento = asiento.NumeroAsiento;
                        asientoExistente.Precio = asiento.Precio;
                        asientoExistente.CompraId = id; // relaciona asiento con compra
                    }
                    else
                    {
                        asiento.CompraId = id;
                        compraExistente.Asientos.Add(asiento);
                    }
                }
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> eliminarCompra(int id)
        {
            var compra = await _context.Set<Compra>()
                .Include(c => c.Asientos)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (compra == null)
                return false;

            _context.Set<AsientoReserva>().RemoveRange(compra.Asientos);
            _context.Set<Compra>().Remove(compra);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Compra> obtenerCompraPorId(int id)
        {
            return await _context.Set<Compra>()
                .Include(c => c.Asientos)
                    .ThenInclude(a => a.CategoriaAsiento)
                .Include(c => c.Reserva)
                    .ThenInclude(r => r.Usuario)
                .Include(c => c.Reserva)
                    .ThenInclude(r => r.Concierto)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<List<Compra>> obtenerCompras()
        {
            return await _context.Set<Compra>()
                .Include(c => c.Asientos)
                    .ThenInclude(a => a.CategoriaAsiento)
                .Include(c => c.Reserva)
                    .ThenInclude(r => r.Usuario)
                .Include(c => c.Reserva)
                    .ThenInclude(r => r.Concierto)
                .ToListAsync();
        }

        public async Task<List<Compra>> obtenerComprasPorUsuario(int usuarioId)
        {
            return await _context.Set<Compra>()
                .Include(c => c.Asientos)
                    .ThenInclude(a => a.CategoriaAsiento)
                .Include(c => c.Reserva)
                    .ThenInclude(r => r.Usuario)
                .Include(c => c.Reserva)
                    .ThenInclude(r => r.Concierto)
                .Where(c => c.Reserva.UsuarioId == usuarioId)
                .ToListAsync();
        }

        public async Task<List<Compra>> obtenerComprasPorConcierto(int conciertoId)
        {
            return await _context.Set<Compra>()
                .Include(c => c.Asientos)
                    .ThenInclude(a => a.CategoriaAsiento)
                .Include(c => c.Reserva)
                    .ThenInclude(r => r.Concierto)
                .Where(c => c.Reserva.ConciertoId == conciertoId)
                .ToListAsync();
        }

        public async Task<bool> cambiarEstadoCompra(int id, string nuevoEstado)
        {
            var compra = await _context.Set<Compra>().FindAsync(id);
            if (compra == null)
                return false;

            compra.Estado = nuevoEstado;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<AsientoReserva>> obtenerAsientosPorCompra(int compraId)
        {
            return await _context.Set<AsientoReserva>()
                .Where(a => a.CompraId == compraId)
                .Include(a => a.CategoriaAsiento)
                .Include(a => a.Reserva)
                .ToListAsync();
        }

        public async Task<bool> marcarCompraComoCompletada(int id)
        {
            var compra = await _context.Set<Compra>().FindAsync(id);
            if (compra == null) return false;

            compra.Estado = "COMPLETADA";
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> cancelarCompra(int id)
        {
            var compra = await _context.Set<Compra>().FindAsync(id);
            if (compra == null) return false;

            compra.Estado = "CANCELADA";
            await _context.SaveChangesAsync();
            return true;
        }

    }
}
