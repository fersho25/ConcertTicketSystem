
using GestionPlataformaConcierto.BC.Modelos;

namespace GestionPlataformaConcierto.BW.CU
{
    public interface IGestionarConciertoBW
    {
        Task<bool> registrarConcierto(Concierto concierto);
        Task<bool> actualizarConcierto(int id, Concierto concierto);

        Task<bool> eliminarConcierto(int id);

        Task<List<Concierto>> obtenerConciertos();

        Task<Concierto> obtenerConciertoPorId(int id);
        ///
        Task<bool> eliminarCategoriaAsiento(int id);

        Task<bool> eliminarArchivoMultimedia(int id);
    }
}
