

using GestionPlataformaConcierto.BC.Modelos;
using GestionPlataformaConcierto.BC.ReglasDeNegocio;
using GestionPlataformaConcierto.BW.CU;
using GestionPlataformaConcierto.BW.Interfaces.DA;

namespace GestionPlataformaConcierto.BW.CU
{
    public class GestionarConciertoBW : IGestionarConciertoBW
    {
        private readonly IGestionarConciertoDA gestionarConciertoDA;
        public GestionarConciertoBW(IGestionarConciertoDA gestionarConciertoDA)
        {
            this.gestionarConciertoDA = gestionarConciertoDA;
        }



        public Task<bool> actualizarConcierto(int id, Concierto concierto)
        {
            if (!ReglasDeConcierto.elIdEsValido(id) || !ReglasDeConcierto.elConciertoEsValido(concierto))
            {
                return Task.FromResult(false);
            }

            return gestionarConciertoDA.actualizarConcierto(id, concierto);

        }

        public Task<bool> cambiarEstadoVenta(int idConcierto)
        {
            return ReglasDeConcierto.elIdEsValido(idConcierto)
                ? gestionarConciertoDA.cambiarEstadoVenta(idConcierto)
                : Task.FromResult(false);
        }

        public Task<bool> eliminarArchivoMultimedia(int id)
        {
            return ReglasDeArchivoMultimedia.elIdEsValido(id)
                ? gestionarConciertoDA.eliminarArchivoMultimedia(id)
                : Task.FromResult(false);
        }

        public Task<bool> eliminarCategoriaAsiento(int id)
        {
            return ReglasDeCategoriaAsiento.elIdEsValido(id)
                ? gestionarConciertoDA.eliminarCategoriaAsiento(id)
                : Task.FromResult(false);
        }

        public Task<bool> eliminarConcierto(int id)
        {
           return ReglasDeConcierto.elIdEsValido(id) 
                ? gestionarConciertoDA.eliminarConcierto(id) 
                : Task.FromResult(false);
        }

        public Task<Concierto> obtenerConciertoPorId(int id)
        {
            return ReglasDeConcierto.elIdEsValido(id) 
                ? gestionarConciertoDA.obtenerConciertoPorId(id) 
                : Task.FromResult<Concierto>(null);
        }

        public Task<List<Concierto>> obtenerConciertos()
        {
            return gestionarConciertoDA.obtenerConciertos();
        }

        public Task<List<Concierto>> ObtenerConciertosPorUsuario(int idUsuario)
        {
            return ReglasDeUsuario.ElIdEsValido(idUsuario)
                ? gestionarConciertoDA.ObtenerConciertosPorUsuario(idUsuario)
                : Task.FromResult(new List<Concierto>());

        }

        public Task<List<Venta>> ObtenerVentaPorConcierto(int idConcierto)
        {
            throw new NotImplementedException();
        }

        public Task<bool> registrarConcierto(Concierto concierto)
        {
            return ReglasDeConcierto.elConciertoEsValido(concierto) 
                ? gestionarConciertoDA.registrarConcierto(concierto) 
                : Task.FromResult(false);
        }
    }
}



