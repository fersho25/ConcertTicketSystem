using GestionPlataformaConcierto.BC.Modelos;

namespace GestionPlataformaConcierto.BC.ReglasDeNegocio
{
    public static class ReglasDeAsientoReserva
    {
        public static bool elAsientoReservaEsValido(AsientoReserva asientoReserva)
        {
            return elIdEsValido(asientoReserva.Id) &&
                   elAsientoIdEsValido(asientoReserva.CategoriaAsientoId) &&
                   elNumeroAsientoEsValido(asientoReserva.NumeroAsiento) &&
                   elPrecioEsValido(asientoReserva.Precio);
        }

        public static bool elIdEsValido( int id)
        {
            return id > 0;
        }

        public static bool elAsientoIdEsValido(int categoriaAsientoId)
        {
            return categoriaAsientoId > 0;
        }

        public static bool elReservaIdEsValido(int reservaId)
        {
            return reservaId > 0;
        }
        public static bool elNumeroAsientoEsValido(int numeroAsiento)
        {
            return numeroAsiento > 0;
        }

        public static bool elPrecioEsValido(decimal precio)
        {
            return precio > 0;
        }
    }
}
