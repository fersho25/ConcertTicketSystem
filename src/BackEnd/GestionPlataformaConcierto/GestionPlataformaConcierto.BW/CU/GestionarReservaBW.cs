using GestionPlataformaConcierto.BC.Modelos;
using GestionPlataformaConcierto.BC.ReglasDeNegocio;
using GestionPlataformaConcierto.BW.Interfaces.BW;
using GestionPlataformaConcierto.BW.Interfaces.DA;

namespace GestionPlataformaConcierto.BW.CU
{
    public class GestionarReservaBW : IGestionarReservaBW
    {
        private readonly IGestionarReservaDA gestionarReservaDA;
        public GestionarReservaBW(IGestionarReservaDA gestionarReservaDA)
        {
            this.gestionarReservaDA = gestionarReservaDA;
        }

        public async Task<bool> actualizarReserva(int id, Reserva reserva)
        {
            if (!ReglasDeReserva.laReservaEsValida(reserva))
                return false;

            reserva.PrecioTotal = ReglasDeReserva.CalcularPrecioTotal(reserva);

            return await gestionarReservaDA.actualizarReserva(id, reserva);
        }

        public async Task<bool> cambiarEstadoReserva(int id, string nuevoEstado)
        {
            var reserva = await gestionarReservaDA.obtenerReservaPorId(id);
            if (reserva == null)
                return false;

            reserva.Estado = nuevoEstado;

            if (!ReglasDeReserva.elEstadoEsValido(reserva))
                return false;

            return await gestionarReservaDA.cambiarEstadoReserva(id, nuevoEstado);
        }

        public async Task<bool> eliminarReserva(int id)
        {
            return await gestionarReservaDA.eliminarReserva(id);
        }

        public async Task<Reserva> obtenerReservaPorId(int id)
        {
            return await gestionarReservaDA.obtenerReservaPorId(id);
        }

        public async Task<List<Reserva>> obtenerReservas()
        {
            return await gestionarReservaDA.obtenerReservas();
        }

        public async Task<List<Reserva>> obtenerReservasPorConcierto(int conciertoId)
        {
            return await gestionarReservaDA.obtenerReservasPorConcierto(conciertoId);
        }

        public async Task<List<Reserva>> obtenerReservasPorEstado(string estado)
        {
            return await gestionarReservaDA.obtenerReservasPorEstado(estado);
        }

        public async Task<List<Reserva>> obtenerReservasPorUsuario(int usuarioId)
        {
            return await gestionarReservaDA.obtenerReservasPorUsuario(usuarioId);
        }

        public async Task<bool> registrarReserva(Reserva reserva)
        {
            if (!ReglasDeReserva.laReservaEsValida(reserva))
                return false;

            reserva.PrecioTotal = ReglasDeReserva.CalcularPrecioTotal(reserva);

            return await gestionarReservaDA.registrarReserva(reserva);
        }
        public async Task<List<AsientoReserva>> ObtenerAsientosPorConcierto(int conciertoId)
        {
            return await gestionarReservaDA.ObtenerAsientosPorConcierto(conciertoId);
        }
    }
}
