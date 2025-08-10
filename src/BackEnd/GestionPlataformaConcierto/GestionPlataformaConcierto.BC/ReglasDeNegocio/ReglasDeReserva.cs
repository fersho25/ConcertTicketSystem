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
                elEstadoEsValido(reserva) &&
                elMetodoPagoEsValido (reserva) &&
                elPrecioTotalEsValido (reserva.PrecioTotal) &&
                elDescuentoEsValido(reserva.DescuentoAplicado) &&
                laPromocionEsValida(reserva) &&
                elCodigoQREsValido(reserva);
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

        public static bool elMetodoPagoEsValido(Reserva reserva)
        {
            
            if (string.IsNullOrWhiteSpace(reserva.MetodoPago))
                return true;

            var metodosValidos = new[] { "STRIPE", "PAYPAL" };
            return metodosValidos.Contains(reserva.MetodoPago.ToUpper());
        }

        public static bool elPrecioTotalEsValido(decimal precioTotal)
        {
            return precioTotal >= 0;
        }

        public static bool elDescuentoEsValido(decimal descuento)
        {
            return descuento >= 0;
        }

        public static bool laPromocionEsValida(Reserva reserva)
        {
            return string.IsNullOrWhiteSpace(reserva.PromocionAplicada) || reserva.PromocionAplicada.Length <= 100;
        }

        public static bool elCodigoQREsValido(Reserva reserva)
        {
            return string.IsNullOrWhiteSpace(reserva.CodigoQR) || reserva.CodigoQR.Length <= 255;
        }

        public static decimal CalcularPrecioTotal(Reserva reserva)
        {
            decimal sumaAsientos = reserva.Asientos?.Sum(a => a.Precio) ?? 0m;

            int cantidadAsientos = reserva.Asientos?.Count ?? 0;

            // Lista de umbrales y descuentos
            var descuentosPorVolumen = new List<(int cantidadMinima, decimal porcentaje)>
    {
        (10, 30m),
        (8, 25m),
        (4, 10m)
    };

            decimal descuento = 0m;

            // Buscar el descuento correspondiente al mayor umbral que se cumple
            foreach (var umbral in descuentosPorVolumen.OrderByDescending(d => d.cantidadMinima))
            {
                if (cantidadAsientos >= umbral.cantidadMinima)
                {
                    descuento = sumaAsientos * (umbral.porcentaje / 100);
                    break;
                }
            }

            decimal montoPromocion = 0m;
            if (!string.IsNullOrWhiteSpace(reserva.PromocionAplicada))
            {
                if (reserva.PromocionAplicada.EndsWith("%"))
                {
                    var porcentajeStr = reserva.PromocionAplicada.TrimEnd('%');
                    if (decimal.TryParse(porcentajeStr, out decimal porcentaje))
                    {
                        montoPromocion = sumaAsientos * (porcentaje / 100);
                    }
                }
                else if (decimal.TryParse(reserva.PromocionAplicada, out decimal promocionFija))
                {
                    montoPromocion = promocionFija;
                }
            }

            decimal total = sumaAsientos - descuento - montoPromocion;
            return total >= 0 ? total : 0;
        }

    }
}
