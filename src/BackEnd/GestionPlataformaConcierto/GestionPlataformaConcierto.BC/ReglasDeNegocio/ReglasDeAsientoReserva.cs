using GestionPlataformaConcierto.BC.Modelos;

namespace GestionPlataformaConcierto.BC.ReglasDeNegocio
{

    public static class ReglasDeAsientoReserva
    {
        private static readonly List<string> EstadosPermitidos = new List<string>
        {
            "Disponible",
            "Reservado",
            "Vendido"
        };
        public static bool elAsientoReservaEsValido(AsientoReserva asientoReserva)
        {
            return elAsientoIdEsValido(asientoReserva.CategoriaAsientoId) &&
                   elNumeroAsientoEsValido(asientoReserva.NumeroAsiento) &&
                   elPrecioEsValido(asientoReserva.Precio);
        }

        public static bool elIdEsValido(int id)
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

        public static EstadoAsiento ObtenerEstadoDelAsiento(AsientoReserva asientoReserva)
        {
            if (asientoReserva.Reserva == null)
                return EstadoAsiento.DISPONIBLE;

            return asientoReserva.Reserva.Estado switch
            {
                "ACTIVA" => EstadoAsiento.RESERVADO,
                "COMPRADA" => EstadoAsiento.COMPRADA,
                _ => EstadoAsiento.DISPONIBLE
            };
        }
    }
}
