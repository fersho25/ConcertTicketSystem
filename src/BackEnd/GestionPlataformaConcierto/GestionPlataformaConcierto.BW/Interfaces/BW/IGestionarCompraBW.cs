using GestionPlataformaConcierto.BC.Modelos;


namespace GestionPlataformaConcierto.BW.Interfaces.BW
{
    public interface IGestionarCompraBW
    {

        Task<bool> registrarCompra(Compra compra);

        Task<bool> actualizarCompra(int id, Compra compra);

        Task<bool> eliminarCompra(int id);

        Task<List<Compra>> obtenerCompras();

        Task<Compra> obtenerCompraPorId(int id);

        Task<List<Compra>> obtenerComprasPorUsuario(int usuarioId);

        Task<List<Compra>> obtenerComprasPorConcierto(int conciertoId);

        Task<bool> cambiarEstadoCompra(int id, string nuevoEstado);

        Task<bool> marcarCompraComoCompletada(int id);

        Task<bool> cancelarCompra(int id);

        Task<List<AsientoReserva>> obtenerAsientosPorCompra(int compraId);

        Task<Reserva> obtenerReservaPorId(int id);
    }
}
