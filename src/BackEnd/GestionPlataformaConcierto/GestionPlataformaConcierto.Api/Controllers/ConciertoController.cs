using GestionPlataformaConcierto.BC.LogicaDeNegocio.DTO;
using GestionPlataformaConcierto.BC.LogicaDeNegocio.Mapeo;
using GestionPlataformaConcierto.BC.Modelos;
using GestionPlataformaConcierto.BW.CU;
using GestionPlataformaConcierto.DA.Entidades;
using Microsoft.AspNetCore.Mvc;

namespace GestionPlataformaConcierto.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ConciertoController : ControllerBase
    {
        private readonly IGestionarConciertoBW gestionarConciertoBW;

        public ConciertoController(IGestionarConciertoBW gestionarConciertoBW)
        {
            this.gestionarConciertoBW = gestionarConciertoBW;
        }

        [HttpPost(Name = "RegistrarConcierto")]
        public async Task<ActionResult<bool>> Post([FromBody] ConciertoDTO conciertoDto)
        {
            try
            {
                var concierto = ConciertoMapper.MapToEntity(conciertoDto);
                var resultado = await gestionarConciertoBW.registrarConcierto(concierto);
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al registrar el concierto: {ex.Message}");
            }
        }

        [HttpPut("{id}", Name = "ActualizarConcierto")]
        public async Task<ActionResult<bool>> Put(int id, [FromBody] ConciertoDTO conciertoDto)
        {
            try
            {
                if (id != conciertoDto.Id)
                {
                    return BadRequest("El ID del concierto no coincide con el parámetro proporcionado.");
                }

                var concierto = ConciertoMapper.MapToEntity(conciertoDto);
                var resultado = await gestionarConciertoBW.actualizarConcierto(id, concierto);

                if (!resultado)
                {
                    return NotFound("Concierto no encontrado");
                }

                return Ok(true);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al actualizar el concierto: {ex.Message}");
            }
        }

        [HttpDelete("{id}", Name = "EliminarConcierto")]
        public async Task<ActionResult<bool>> Delete(int id)
        {
            try
            {
                var resultado = await gestionarConciertoBW.eliminarConcierto(id);
                if (!resultado)
                {
                    return NotFound("Concierto no encontrado");
                }
                return Ok(true);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al eliminar el concierto: {ex.Message}");
            }
        }

        [HttpDelete("archivoMultimedia/{id}", Name = "EliminarArchivoMultimedia")]
        public async Task<ActionResult<bool>> EliminarArchivoMultimedia(int id)
        {
            try
            {
                var resultado = await gestionarConciertoBW.eliminarArchivoMultimedia(id);
                if (!resultado)
                {
                    return NotFound("Archivo multimedia no encontrado");
                }
                return Ok(true);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al eliminar el archivo multimedia: {ex.Message}");
            }
        }

        [HttpDelete("categoriaAsiento/{id}", Name = "EliminarCategoriaAsiento")]
        public async Task<ActionResult<bool>> EliminarCategoriaAsiento(int id)
        {
            try
            {
                var resultado = await gestionarConciertoBW.eliminarCategoriaAsiento(id);
                if (!resultado)
                {
                    return NotFound("Categoría de asiento no encontrada");
                }
                return Ok(true);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al eliminar la categoría de asiento: {ex.Message}");
            }
        }

        [HttpGet(Name = "ObtenerConciertos")]
        public async Task<ActionResult<List<ConciertoDTO>>> Get()
        {
            try
            {
                var conciertos = await gestionarConciertoBW.obtenerConciertos();
                var conciertosDTO = conciertos.Select(c => ConciertoMapper.MapToDTO(c)).ToList();
                return Ok(conciertosDTO);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al obtener los conciertos: {ex.Message}");
            }
        }

        [HttpGet("{id}", Name = "ObtenerConciertoPorId")]
        public async Task<ActionResult<ConciertoDTO>> Get(int id)
        {
            try
            {
                var concierto = await gestionarConciertoBW.obtenerConciertoPorId(id);
                if (concierto == null)
                {
                    return NotFound("Concierto no encontrado");
                }
                var conciertoDTO = ConciertoMapper.MapToDTO(concierto);
                return Ok(conciertoDTO);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al obtener el concierto: {ex.Message}");
            }
        }

        [HttpGet("usuario/{idUsuario}", Name = "ObtenerConciertosPorUsuario")]
        public async Task<ActionResult<List<ConciertoDTO>>> GetConciertosPorUsuario(int idUsuario)
        {
            try
            {
                var conciertos = await gestionarConciertoBW.ObtenerConciertosPorUsuario(idUsuario);
                var conciertosDTO = conciertos.Select(c => ConciertoMapper.MapToDTO(c)).ToList();
                return Ok(conciertosDTO);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al obtener los conciertos del usuario: {ex.Message}");
            }

        }

        [HttpPut("{id}/venta", Name = "ActualizarVenta")]
        public async Task<ActionResult<bool>> Put(int id, [FromBody] Venta venta)
        {
            try
            {
                if (id != venta.Id)
                {
                    return BadRequest("El ID de la venta no coincide con el parámetro proporcionado.");
                }

                var resultado = await gestionarConciertoBW.cambiarEstadoVenta(venta.ConciertoId, id, venta);

                if (!resultado)
                {
                    return NotFound("Venta no encontrada o no válida.");
                }

                return Ok(true);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al actualizar la venta: {ex.Message}");
            }
        }

    }
}


