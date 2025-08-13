using GestionPlataformaConcierto.BC.LogicaDeNegocio.DTO;
using GestionPlataformaConcierto.BC.Modelos;

namespace GestionPlataformaConcierto.BC.LogicaDeNegocio.Mapeo
{
    public static class ReservaPutMapper
    {
        public static Reserva MapToEntity(ReservaPutDTO reservaPutdto)
        {
            return new Reserva
            {
                Id = reservaPutdto.Id,
                UsuarioId = reservaPutdto.UsuarioId,
                ConciertoId = reservaPutdto.ConciertoId,
                FechaHoraReserva = reservaPutdto.FechaHoraReserva,
                FechaHoraExpiracion = reservaPutdto.FechaHoraExpiracion,
                Estado = reservaPutdto.Estado,
                Asientos = reservaPutdto.Asientos == null ? new List<AsientoReserva>() : reservaPutdto.Asientos.Select(a => new AsientoReserva
                {
                    Id = a.Id,
                    CategoriaAsientoId = a.CategoriaAsientoId,
                    NumeroAsiento = a.NumeroAsiento,
                    Precio = a.Precio
                }).ToList()
            };
        }
    }
}
