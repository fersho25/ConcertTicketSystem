using GestionPlataformaConcierto.BC.Modelos;
using GestionPlataformaConcierto.BC.ReglasDeNegocio;
using GestionPlataformaConcierto.BW.Interfaces.BW;
using GestionPlataformaConcierto.BW.Interfaces.DA;

namespace GestionPlataformaConcierto.BW.CU
{
    public class GestionarCompraBW : IGestionarCompraBW
    {
        private readonly IGestionarCompraDA gestionarCompraDA;

        public GestionarCompraBW(IGestionarCompraDA gestionarCompraDA)
        {
            this.gestionarCompraDA = gestionarCompraDA;
        }

        public async Task<bool> registrarCompra(Compra compra)
        {
            if (!ReglasDeCompra.laCompraEsValida(compra))
                return false;

            return await gestionarCompraDA.registrarCompra(compra);
        }

        public async Task<bool> actualizarCompra(int id, Compra compra)
        {
            if (!ReglasDeCompra.laCompraEsValida(compra))
                return false;

            return await gestionarCompraDA.actualizarCompra(id, compra);
        }

        public async Task<bool> eliminarCompra(int id)
        {
            return await gestionarCompraDA.eliminarCompra(id);
        }

        public async Task<Compra> obtenerCompraPorId(int id)
        {
            return await gestionarCompraDA.obtenerCompraPorId(id);
        }

        public async Task<List<Compra>> obtenerCompras()
        {
            return await gestionarCompraDA.obtenerCompras();
        }

        public async Task<List<Compra>> obtenerComprasPorUsuario(int usuarioId)
        {
            return await gestionarCompraDA.obtenerComprasPorUsuario(usuarioId);
        }

        public async Task<List<Compra>> obtenerComprasPorConcierto(int conciertoId)
        {
            return await gestionarCompraDA.obtenerComprasPorConcierto(conciertoId);
        }

        public async Task<bool> cambiarEstadoCompra(int id, string nuevoEstado)
        {
            var compra = await gestionarCompraDA.obtenerCompraPorId(id);
            if (compra == null)
                return false;

            compra.Estado = nuevoEstado;

            if (!ReglasDeCompra.elEstadoEsValido(compra))
                return false;

            return await gestionarCompraDA.cambiarEstadoCompra(id, nuevoEstado);
        }

        public async Task<bool> marcarCompraComoCompletada(int id)
        {
            return await cambiarEstadoCompra(id, "COMPLETADA");
        }

        public async Task<bool> cancelarCompra(int id)
        {
            return await cambiarEstadoCompra(id, "CANCELADA");
        }

        public async Task<List<AsientoReserva>> obtenerAsientosPorCompra(int compraId)
        {
            return await gestionarCompraDA.obtenerAsientosPorCompra(compraId);
        }
    }
}
