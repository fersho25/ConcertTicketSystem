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
                Asientos = dto.Asientos?.Select(a => new AsientoReserva
                {
                    CategoriaAsientoId = a.CategoriaAsientoId,
                    NumeroAsiento = a.NumeroAsiento,
                    Precio = a.Precio
                }).ToList()
            };
        }
            
public static ReservaDTO MapToDTO(Reserva entity)
        {
            if (entity == null) return null;

            return new ReservaDTO
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
