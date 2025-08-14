using GestionPlataformaConcierto.BC.DTOs;
using GestionPlataformaConcierto.BC.LogicaDeNegocio.DTO;
using GestionPlataformaConcierto.BC.LogicaDeNegocio.Mapeo;
using GestionPlataformaConcierto.BC.Modelos;
using GestionPlataformaConcierto.BC.ReglasDeNegocio;
using GestionPlataformaConcierto.BW.Interfaces.BW;
using Microsoft.AspNetCore.Mvc;

namespace GestionPlataformaConcierto.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CompraController : ControllerBase
    {
        private readonly IGestionarCompraBW _gestionarCompraBW;

        public CompraController(IGestionarCompraBW gestionarCompraBW)
        {
            _gestionarCompraBW = gestionarCompraBW;
        }

        [HttpGet(Name = "ObtenerCompras")]
        public async Task<ActionResult<List<CompraDTO>>> Get()
        {
            try
            {
                var compras = await _gestionarCompraBW.obtenerCompras();
                var comprasDTO = compras.Select(CompraMapper.MapToDTO).ToList();
                return Ok(comprasDTO);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al obtener las compras: {ex.Message}");
            }
        }

        [HttpGet("{id}", Name = "ObtenerCompraPorId")]
        public async Task<ActionResult<CompraDTO>> Get(int id)
        {
            try
            {
                var compra = await _gestionarCompraBW.obtenerCompraPorId(id);
                if (compra == null)
                    return NotFound("Compra no encontrada");

                return Ok(CompraMapper.MapToDTO(compra));
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al obtener la compra: {ex.Message}");
            }
        }

        [HttpGet("usuario/{usuarioId}", Name = "ObtenerComprasPorUsuario")]
        public async Task<ActionResult<List<CompraDTO>>> GetPorUsuario(int usuarioId)
        {
            try
            {
                var compras = await _gestionarCompraBW.obtenerComprasPorUsuario(usuarioId);
                var comprasDTO = compras.Select(CompraMapper.MapToDTO).ToList();
                return Ok(comprasDTO);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al obtener compras por usuario: {ex.Message}");
            }
        }

        [HttpGet("concierto/{conciertoId}", Name = "ObtenerComprasPorConcierto")]
        public async Task<ActionResult<List<CompraDTO>>> GetPorConcierto(int conciertoId)
        {
            try
            {
                var compras = await _gestionarCompraBW.obtenerComprasPorConcierto(conciertoId);
                var comprasDTO = compras.Select(CompraMapper.MapToDTO).ToList();
                return Ok(comprasDTO);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al obtener compras por concierto: {ex.Message}");
            }
        }

        [HttpPost(Name = "RegistrarCompra")]
        public async Task<ActionResult<bool>> Post([FromBody] CompraDTO compraDto)
        {
            try
            {
                var reserva = await _gestionarCompraBW.obtenerReservaPorId(compraDto.ReservaId);
                if (reserva == null)
                    return BadRequest("La reserva indicada no existe.");

                // Mapear a entidad incluyendo los asientos
                var compra = CompraMapper.MapToEntity(compraDto, reserva);

                // Guardar la compra
                var ok = await _gestionarCompraBW.registrarCompra(compra);
                if (!ok) return BadRequest("No se pudo registrar la compra.");

                return Ok(true);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al registrar la compra: {ex.Message}");
            }
        }

        [HttpPut("{id}", Name = "ActualizarCompra")]
        public async Task<ActionResult<bool>> Put(int id, [FromBody] CompraDTO compraDto)
        {
            try
            {
                if (id != compraDto.Id)
                    return BadRequest("El ID no coincide con el parámetro.");

                var compra = CompraMapper.MapToEntity(compraDto);
                compra.PrecioTotal = ReglasDeCompra.CalcularPrecioTotal(compra);

                var ok = await _gestionarCompraBW.actualizarCompra(id, compra);
                if (!ok) return NotFound("Compra no encontrada");

                return Ok(true);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al actualizar la compra: {ex.Message}");
            }
        }

        [HttpDelete("{id}", Name = "EliminarCompra")]
        public async Task<ActionResult<bool>> Delete(int id)
        {
            try
            {
                var ok = await _gestionarCompraBW.eliminarCompra(id);
                if (!ok) return NotFound("Compra no encontrada");
                return Ok(true);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al eliminar la compra: {ex.Message}");
            }
        }

        // PUT: api/compra/{id}/cambiarEstado
        [HttpPut("{id}/cambiarEstado", Name = "CambiarEstadoCompra")]
        public async Task<ActionResult<bool>> CambiarEstado(int id, [FromBody] string nuevoEstado)
        {
            try
            {
                var ok = await _gestionarCompraBW.cambiarEstadoCompra(id, nuevoEstado);
                if (!ok) return NotFound("Compra no encontrada o estado inválido");
                return Ok(true);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al cambiar el estado de la compra: {ex.Message}");
            }
        }

        [HttpGet("{id}/asientos", Name = "ObtenerAsientosPorCompra")]
        public async Task<ActionResult<List<AsientoReservaDTO>>> ObtenerAsientosPorCompra(int id)
        {
            try
            {
                var asientos = await _gestionarCompraBW.obtenerAsientosPorCompra(id);
                var dto = asientos?.Select(a => new AsientoReservaDTO
                {
                    CategoriaAsientoId = a.CategoriaAsientoId,
                    NumeroAsiento = a.NumeroAsiento,
                    Precio = a.Precio
                }).ToList() ?? new List<AsientoReservaDTO>();

                return Ok(dto);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al obtener asientos de la compra: {ex.Message}");
            }
        }
    }
}
