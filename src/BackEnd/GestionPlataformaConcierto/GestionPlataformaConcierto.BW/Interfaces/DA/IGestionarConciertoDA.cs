
using GestionPlataformaConcierto.BC.LogicaDeNegocio.DTO;
using GestionPlataformaConcierto.BC.Modelos;

namespace GestionPlataformaConcierto.BW.Interfaces.DA
{
    public interface IGestionarConciertoDA
    {
        Task<bool> registrarConcierto(Concierto concierto);
        Task<bool> actualizarConcierto(int id, Concierto concierto);

        Task<bool> eliminarConcierto(int id);

        Task<List<Concierto>> obtenerConciertos();

        Task<Concierto> obtenerConciertoPorId(int id);
        ///
        Task<bool> eliminarCategoriaAsiento(int id);

        Task<bool> eliminarArchivoMultimedia(int id);

        Task<List<Concierto>> ObtenerConciertosPorUsuario(int idUsuario);

        Task<IEnumerable<SaleDetailDto>> GetSalesDetailsByConcertAsync(int concertId);

        Task<bool> cambiarEstadoVenta(int idConcierto);

        Task<List<Venta>> ObtenerVentaPorConcierto(int idConcierto);
    }
}
