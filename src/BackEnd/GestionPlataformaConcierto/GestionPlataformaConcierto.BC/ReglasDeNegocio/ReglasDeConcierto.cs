using GestionPlataformaConcierto.BC.Modelos;

namespace GestionPlataformaConcierto.BC.ReglasDeNegocio
{
    public class ReglasDeConcierto
    {
        public static bool elConciertoEsValido(Concierto concierto)
        {
            return elNombreEsValido(concierto) &&
                   laDescripcionEsValida(concierto) &&
                   laFechaEsValida(concierto) &&
                   elLugarEsValido(concierto) &&
                   laCapacidadEsValida(concierto) &&
                   laCategoriaAsientoEsValida(concierto) &&
                   laMultimediaEsValida(concierto) &&
                   ventaEsValida(concierto) &&
                    promocionesSonValidas(concierto);

        }

        public static bool elNombreEsValido(Concierto concierto)
        {
            return !string.IsNullOrEmpty(concierto.Nombre) && concierto.Nombre.Length >= 5 && concierto.Nombre.Length <= 100;
        }

        public static bool laDescripcionEsValida(Concierto concierto)
        {
            return !string.IsNullOrEmpty(concierto.Descripcion) && concierto.Descripcion.Length >= 50;
        }

        public static bool laFechaEsValida(Concierto concierto)
        {
            return concierto.Fecha > DateTime.Now;
        }

        public static bool elLugarEsValido(Concierto concierto)
        {
            return !string.IsNullOrEmpty(concierto.Lugar) && concierto.Lugar.Length >= 5 && concierto.Lugar.Length <= 100;
        }

        public static bool laCapacidadEsValida(Concierto concierto)
        {
            return concierto.Capacidad > 0;
        }

        public static bool laCategoriaAsientoEsValida(Concierto concierto)
        {
            if (concierto.CategoriasAsiento == null || !concierto.CategoriasAsiento.Any())
                return false;

            return concierto.CategoriasAsiento.All(categoria => ReglasDeCategoriaAsiento.laCategoriaEsValida(categoria));
        }

        public static bool laMultimediaEsValida(Concierto concierto)
        {
            if (concierto.ArchivosMultimedia == null || !concierto.ArchivosMultimedia.Any())
                return false;

            return concierto.ArchivosMultimedia.All(archivo => ReglasDeArchivoMultimedia.ElArchivoEsValido(archivo));
        }
        public static bool ventaEsValida(Concierto concierto)
        {
            return ReglasDeVenta.VentaEsValida(concierto.Venta, concierto);
        }

        public static bool promocionesSonValidas(Concierto concierto)
        {
            if (concierto.Promociones == null || !concierto.Promociones.Any())
                return false;

            return concierto.Promociones.All(promocion => ReglasDePomocion.laPromocionEsValida(promocion));

        }
        public static bool elIdEsValido(int id)
        {
            return id > 0;

        }

    }
}
