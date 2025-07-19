using GestionPlataformaConcierto.BC.Modelos;

namespace GestionPlataformaConcierto.BC.ReglasDeNegocio
{
    public class ReglasDeCategoriaAsiento
    {
        public static bool laCategoriaEsValida(CategoriaAsiento categoriaAsiento)
        {
            return elNombreEsValido(categoriaAsiento) &&
                   laCantidadDeAsientosEsValida(categoriaAsiento) &&
                   elPrecioEsValido(categoriaAsiento);
        }

        public static bool elNombreEsValido(CategoriaAsiento categoriaAsiento)
        {
            return !string.IsNullOrEmpty(categoriaAsiento.Nombre) && categoriaAsiento.Nombre.Length >= 3 && categoriaAsiento.Nombre.Length <= 50;
        }

        public static bool laCantidadDeAsientosEsValida(CategoriaAsiento categoriaAsiento)
        {
            return categoriaAsiento.CantidadAsientos > 0;
        }

        public static bool elPrecioEsValido(CategoriaAsiento categoriaAsiento)
        {
            return categoriaAsiento.Precio > 0;
        }
        public static bool elIdEsValido(int id)
        {
            return id > 0;

        }
    }
}
