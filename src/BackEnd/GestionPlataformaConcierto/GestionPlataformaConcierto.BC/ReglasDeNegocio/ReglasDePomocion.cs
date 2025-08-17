using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GestionPlataformaConcierto.BC.Modelos;

namespace GestionPlataformaConcierto.BC.ReglasDeNegocio
{
    public class ReglasDePomocion
    {

        public static bool laPromocionEsValida(Promocion promocion)
        {
         return elNombreEsValido(promocion) &&
                elDescuentoEsValido(promocion);
        }

        public static bool elNombreEsValido(Promocion promocion)
        {
            return !string.IsNullOrEmpty(promocion.Nombre) && promocion.Nombre.Length >= 5 && promocion.Nombre.Length <= 100;
        }

        public static bool elDescuentoEsValido(Promocion promocion)
        {
            return promocion.Descuento >= 0 && promocion.Descuento <= 100;
        }

    }
}
