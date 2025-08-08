using GestionPlataformaConcierto.BC.Modelos;

namespace GestionPlataformaConcierto.BC.ReglasDeNegocio
{

    public static class ReglasDeReserva
    {
        public static bool laReservaEsValida(Reserva reserva)
        {
            return
                elIdEsValido(reserva.id) &&
                elIdConciertoEsValido(reserva.ConciertoId) &&
                elIdUsuarioEsValido(reserva.UsuarioId) &&
                elAsientoReservaEsValido(reserva);
        }

        public static bool elIdEsValido(int id)
        {
            return id > 0;
        }

        public static bool elIdConciertoEsValido(int ConciertoId)
        {
            return ConciertoId > 0;
        }

        public static bool elIdUsuarioEsValido(int UsuarioId)
        {
            return UsuarioId > 0;
        }

        public static bool elAsientoReservaEsValido(Reserva reserva)
        {
            if (reserva.Asientos == null || !reserva.Asientos.Any())
                return false;

            return reserva.Asientos.All(asiento => ReglasDeAsientoReserva.elAsientoReservaEsValido(asiento));
        }
    }
}
