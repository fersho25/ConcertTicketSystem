using GestionPlataformaConcierto.BC.Modelos;

namespace GestionPlataformaConcierto.BC.ReglasDeNegocio
{
    public static class ReglasDeCompra
    {
        public static bool laCompraEsValida(Compra compra)
        {
            return
                elMetodoPagoEsValido(compra) &&
                elPrecioTotalEsValido(compra.PrecioTotal) &&
                elDescuentoEsValido(compra.DescuentoAplicado) &&
                laPromocionEsValida(compra) &&
                elCodigoQREsValido(compra) &&
                elEstadoEsValido(compra);
        }
        public static bool elIdEsValido(int id)
        {
            return id > 0;
        }

        public static bool elIdReservaEsValido(int ReservaId)
        {
            return ReservaId > 0;
        }
        public static bool elMetodoPagoEsValido(Compra compra)
        {

            if (string.IsNullOrWhiteSpace(compra.MetodoPago))
                return false;

            var metodosValidos = new[] { "STRIPE", "PAYPAL" };
            return metodosValidos.Contains(compra.MetodoPago.ToUpper());
        }

        public static bool elPrecioTotalEsValido(decimal precioTotal)
        {
            return precioTotal >= 0;
        }

        public static bool elDescuentoEsValido(decimal descuentoAplicado)
        {
            return descuentoAplicado >= 0;
        }

        public static bool laPromocionEsValida(Compra compra)
        {
            return string.IsNullOrWhiteSpace(compra.PromocionAplicada) || compra.PromocionAplicada.Length <= 100;
        }

        public static bool elCodigoQREsValido(Compra compra)
        {
            return string.IsNullOrWhiteSpace(compra.CodigoQR) || compra.CodigoQR.Length <= 255;
        }

        public static decimal CalcularPrecioTotal(Compra compra)
        {
            decimal sumaAsientos = compra.Asientos.Sum(a => a.Precio);
            int cantidadAsientos = compra.Asientos.Count;

            var descuentosPorVolumen = new List<(int cantidadMinima, decimal porcentaje)>
    {
        (10, 30m),
        (8, 25m),
        (4, 10m)
    };

            decimal descuento = 0m;

            
            foreach (var umbral in descuentosPorVolumen.OrderByDescending(d => d.cantidadMinima))
            {
                if (cantidadAsientos >= umbral.cantidadMinima)
                {
                    descuento = sumaAsientos * (umbral.porcentaje / 100);
                    break;
                }
            }

            
            decimal montoPromocion = 0m;
            if (!string.IsNullOrWhiteSpace(compra.PromocionAplicada))
            {
                if (compra.PromocionAplicada.EndsWith("%"))
                {
                    var porcentajeStr = compra.PromocionAplicada.TrimEnd('%');
                    if (decimal.TryParse(porcentajeStr, out decimal porcentaje))
                    {
                        montoPromocion = sumaAsientos * (porcentaje / 100);
                    }
                }
                else if (decimal.TryParse(compra.PromocionAplicada, out decimal promocionFija))
                {
                    montoPromocion = promocionFija;
                }
            }

            compra.DescuentoAplicado = descuento + montoPromocion;

            decimal total = sumaAsientos - descuento - montoPromocion;
            return total >= 0 ? total : 0;
        }


        public static bool elEstadoEsValido(Compra compra)
        {
            var estadosValidos = new[] { "ACTIVA", "VENCIDA", "COMPRADA", "CANCELADA" };
            return !string.IsNullOrWhiteSpace(compra.Estado) &&
                   estadosValidos.Contains(compra.Estado.ToUpper());
        }
    }
}
