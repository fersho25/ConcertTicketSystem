using GestionPlataformaConcierto.BC.Modelos;

namespace GestionPlataformaConcierto.BW.Interfaces.DA
{
    public interface IGestionarReservaDA
    {
        Task<bool> registrarReserva(Reserva reserva);
        Task<bool> actualizarReserva(int id, Reserva reserva);
        Task<bool> eliminarReserva(int id);
        Task<List<Reserva>> obtenerReservas();
        Task<Reserva> obtenerReservaPorId(int id);

        Task<List<Reserva>> obtenerReservasPorUsuario(int usuarioId);
        Task<List<Reserva>> obtenerReservasPorConcierto(int conciertoId);
        Task<List<Reserva>> obtenerReservasPorEstado(string estado);

        Task<bool> cambiarEstadoReserva(int id, string nuevoEstado);

        Task<List<AsientoReserva>> ObtenerAsientosPorConcierto(int conciertoId);
    }
}
