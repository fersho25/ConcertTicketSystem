using GestionPlataformaConcierto.BC.Modelos;

namespace GestionPlataformaConcierto.BC.ReglasDeNegocio
{

    public static class ReglasDeReserva
    {
        public static bool laReservaEsValida(Reserva reserva)
        {
            return
                elIdConciertoEsValido(reserva.ConciertoId) &&
                elIdUsuarioEsValido(reserva.UsuarioId) &&
                elAsientoReservaEsValido(reserva) &&
                lasFechasSonValidas(reserva.FechaHoraReserva, reserva.FechaHoraExpiracion) &&
                elEstadoEsValido(reserva);
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

        public static bool lasFechasSonValidas(DateTime fechaReserva, DateTime fechaExpiracion)
        {
            return fechaReserva < fechaExpiracion &&
                   (fechaExpiracion - fechaReserva).TotalMinutes <= 15;
        }

        public static bool elEstadoEsValido(Reserva reserva)
        {
            var estadosValidos = new[] { "ACTIVA", "VENCIDA", "COMPRADA", "CANCELADA" };
            return !string.IsNullOrWhiteSpace(reserva.Estado) &&
                   estadosValidos.Contains(reserva.Estado.ToUpper());
        }

    }
}
