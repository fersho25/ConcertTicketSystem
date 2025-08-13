using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GestionPlataformaConcierto.BC.LogicaDeNegocio.Enum;
using GestionPlataformaConcierto.BC.Modelos;

namespace GestionPlataformaConcierto.BC.ReglasDeNegocio
{
    public class ReglasDeVenta
    {
        public static bool ventaEsValida(Venta venta)
        {
            return fechasEsValida(venta) &&
                conciertoEsValido(venta)&&
                ValidarEstado(venta);
        }

        private  static bool fechasEsValida(Venta venta)
        {
            if (venta.FechaInicio >= venta.FechaFin)
                return false;

            if (venta.FechaInicio.Date < DateTime.Now.Date && venta.Estado == EstadoVenta.Activo)
                return false;

            return true;
        }

        private static bool conciertoEsValido(Venta venta)
        {
            if (venta.ConciertoId <= 0)
                return false;

            if (venta.Concierto == null)
                return false;

            return true;
        }

        private static bool ValidarEstado(Venta venta)
        {
            if (!Enum.IsDefined(typeof(EstadoVenta), venta.Estado))
                return false;

            return  true;
        }
    }
}
