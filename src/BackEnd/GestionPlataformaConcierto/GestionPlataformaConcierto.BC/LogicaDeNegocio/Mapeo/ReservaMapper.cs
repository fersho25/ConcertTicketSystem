using GestionPlataformaConcierto.BC.LogicaDeNegocio.DTO;
using GestionPlataformaConcierto.BC.Modelos;

namespace GestionPlataformaConcierto.BC.LogicaDeNegocio.Mapeo
{
    public static class ReservaMapper
    {
        public static Reserva MapToEntity(ReservaDTO dto)
        {
            if (dto == null) return null;

            return new Reserva
            {
                UsuarioId = dto.UsuarioId,
                ConciertoId = dto.ConciertoId,
                FechaHoraReserva = dto.FechaHoraReserva,
                FechaHoraExpiracion = dto.FechaHoraExpiracion,
                Estado = dto.Estado,
                MetodoPago = dto.MetodoPago,
                FechaHoraCompra = dto.FechaHoraCompra,
                PrecioTotal = dto.PrecioTotal,
                DescuentoAplicado = dto.DescuentoAplicado,
                PromocionAplicada = dto.PromocionAplicada,
                CodigoQR = dto.CodigoQR,
                Notificado = dto.Notificado,
                Asientos = dto.Asientos?.Select(a => new AsientoReserva
                {
                    CategoriaAsientoId = a.CategoriaAsientoId,
                    NumeroAsiento = a.NumeroAsiento,
                    Precio = a.Precio
                }).ToList()
            };
        }
    }
}
