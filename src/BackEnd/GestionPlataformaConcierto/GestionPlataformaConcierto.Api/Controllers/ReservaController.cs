using GestionPlataformaConcierto.BC.LogicaDeNegocio.DTO;
using GestionPlataformaConcierto.BC.LogicaDeNegocio.Mapeo;
using GestionPlataformaConcierto.BC.Modelos;
using GestionPlataformaConcierto.BC.ReglasDeNegocio;
using GestionPlataformaConcierto.DA.Config;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GestionPlataformaConcierto.BW.Interfaces.BW;

namespace GestionPlataformaConcierto.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReservaController : ControllerBase
    {
        private readonly IGestionarReservaBW gestionarReservaBW;
        private readonly GestionDePlataformaContext _context;

        public ReservaController(IGestionarReservaBW gestionarReservaBW, GestionDePlataformaContext context)
        {
            this.gestionarReservaBW = gestionarReservaBW;
            this._context = context;
        }

        [HttpGet(Name = "ObtenerReservas")]
        public async Task<ActionResult<List<ReservaGetDTO>>> Get()
        {
            try
            {
                var reservas = await gestionarReservaBW.obtenerReservas();
                var reservasDTO = reservas.Select(ReservaGetMapper.ToDTO).ToList();
                return Ok(reservasDTO);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al obtener las reservas: {ex.Message}");
            }
        }

        [HttpGet("{id}", Name = "ObtenerReservaPorId")]
        public async Task<ActionResult<ReservaGetDTO>> Get(int id)
        {
            try
            {
                var reserva = await gestionarReservaBW.obtenerReservaPorId(id);
                if (reserva == null)
                    return NotFound("Reserva no encontrada");

                var reservaDTO = ReservaGetMapper.ToDTO(reserva);
                return Ok(reservaDTO);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al obtener la reserva: {ex.Message}");
            }
        }

        [HttpPost(Name = "RegistrarReserva")]
        public async Task<ActionResult<ReservaDTO>> Post([FromBody] ReservaDTO reservaDto)
        {
            try
            {
                var reserva = ReservaMapper.MapToEntity(reservaDto);

                var reservaCreada = await gestionarReservaBW.registrarReserva(reserva);

                if (reservaCreada == null)
                    return BadRequest("No se pudo registrar la reserva.");

                return Ok(ReservaMapper.MapToDTO(reservaCreada));
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al registrar la reserva: {ex.Message}");
            }
        }


        [HttpPut("{id}", Name = "ActualizarReserva")]
        public async Task<ActionResult<bool>> Put(int id, [FromBody] ReservaPutDTO reservaPutDto)
        {
            try
            {
                if (id != reservaPutDto.Id)
                    return BadRequest("El ID no coincide con el parámetro.");

                var reserva = ReservaPutMapper.MapToEntity(reservaPutDto);

               var resultado = await gestionarReservaBW.actualizarReserva(id, reserva);

                if (!resultado)
                    return NotFound("Reserva no encontrada");

                return Ok(true);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al actualizar la reserva: {ex.Message}");
            }
        }

        [HttpDelete("{id}", Name = "EliminarReserva")]
        public async Task<ActionResult<bool>> Delete(int id)
        {
            try
            {
                var resultado = await gestionarReservaBW.eliminarReserva(id);
                if (!resultado)
                    return NotFound("Reserva no encontrada");

                return Ok(true);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al eliminar la reserva: {ex.Message}");
            }
        }

        [HttpPut("{id}/cambiarEstado", Name = "CambiarEstadoReserva")]
        public async Task<ActionResult<bool>> CambiarEstado(int id, [FromBody] string nuevoEstado)
        {
            try
            {
                var resultado = await gestionarReservaBW.cambiarEstadoReserva(id, nuevoEstado);
                if (!resultado)
                    return NotFound("Reserva no encontrada o estado inválido");

                return Ok(true);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al cambiar el estado de la reserva: {ex.Message}");
            }
        }

        [HttpGet("mapa-asientos/{conciertoId}")]
        public async Task<ActionResult<IEnumerable<AsientoMapaDTO>>> ObtenerMapaAsientos(int conciertoId)
        {
            try
            {
                var categorias = await _context.CategoriaAsiento
                    .Where(c => c.ConciertoId == conciertoId)
                    .ToListAsync();

                var reservas = await _context.AsientoReserva
                    .Include(ar => ar.Reserva)
                    .Where(ar => ar.Reserva.ConciertoId == conciertoId)
                    .ToListAsync();

                var resultado = new List<AsientoMapaDTO>();

                foreach (var categoria in categorias)
                {
                    for (int i = 1; i <= categoria.CantidadAsientos; i++)
                    {
                        var asientoReservado = reservas.FirstOrDefault(ar =>
                            ar.NumeroAsiento == i && ar.CategoriaAsientoId == categoria.Id);

                        EstadoAsiento estadoEnum = EstadoAsiento.DISPONIBLE;

                        if (asientoReservado != null)
                        {
                            estadoEnum = ReglasDeAsientoReserva.ObtenerEstadoDelAsiento(asientoReservado);
                        }

                        resultado.Add(new AsientoMapaDTO
                        {
                            CategoriaAsientoId = categoria.Id,
                            CategoriaNombre = categoria.Nombre,
                            NumeroAsiento = i,
                            Precio = categoria.Precio,
                            Estado = estadoEnum.ToString().ToUpper() 
                        });
                    }
                }

                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al obtener el mapa de asientos: {ex.Message}");
            }
        }
        [HttpGet("asientos-reserva/{reservaId}")]
        public async Task<ActionResult<List<AsientoReservaGetDTO>>> ObtenerAsientosPorReserva(int reservaId)
        {
            try
            {
                var asientosDto = await gestionarReservaBW.ObtenerAsientosDTOPorReserva(reservaId);

                if (asientosDto == null || !asientosDto.Any())
                    return NotFound("No se encontraron asientos para la reserva.");

                return Ok(asientosDto);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al obtener los asientos de la reserva: {ex.Message}");
            }
        }

    }
}

