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
        public static bool VentaEsValida(Venta venta, Concierto concierto)
        {
            return FechasEsValida(venta, concierto) &&
                   conciertoEsValido(venta, concierto) &&
                   ValidarEstado(venta);
        }

        private static bool FechasEsValida(Venta venta, Concierto concierto)
        {
            if (venta.FechaFin <= DateTime.Now)
                return false;

            if (venta.FechaFin >= concierto.Fecha)
                return false;

            return true;
        }

        private static bool conciertoEsValido(Venta venta, Concierto concierto)
        {

            if (concierto == null)
                return false;

            if (concierto.Id < 0)
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
