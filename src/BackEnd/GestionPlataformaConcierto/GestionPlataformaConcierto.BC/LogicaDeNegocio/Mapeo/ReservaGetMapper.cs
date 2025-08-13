using GestionPlataformaConcierto.BC.LogicaDeNegocio.DTO;
using GestionPlataformaConcierto.BC.Modelos;

namespace GestionPlataformaConcierto.BC.LogicaDeNegocio.Mapeo
{
    public static class ReservaGetMapper
    {
        public static ReservaGetDTO ToDTO(Reserva entity)
        {
            if (entity == null) return null;

            return new ReservaGetDTO
            {
                Id = entity.Id,
                UsuarioId = entity.UsuarioId,
                ConciertoId = entity.ConciertoId,
                FechaHoraReserva = entity.FechaHoraReserva,
                FechaHoraExpiracion = entity.FechaHoraExpiracion,
                Estado = entity.Estado,
                Asientos = entity.Asientos?.Select(a => new AsientoReservaDTO
                {
                    CategoriaAsientoId = a.CategoriaAsientoId,
                    NumeroAsiento = a.NumeroAsiento,
                    Precio = a.Precio
                }).ToList()
            };
        }
    }
}
