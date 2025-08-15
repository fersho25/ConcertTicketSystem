using GestionPlataformaConcierto.BC.LogicaDeNegocio.DTO;
using GestionPlataformaConcierto.BC.LogicaDeNegocio.Mapeo;
using GestionPlataformaConcierto.BW.CU;
using GestionPlataformaConcierto.BW.Interfaces.BW;
using Microsoft.AspNetCore.Mvc;

namespace GestionPlataformaConcierto.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuarioController : ControllerBase
    {
        private readonly IGestionarUsuarioBW gestionarUsuarioBW;

        public UsuarioController(IGestionarUsuarioBW gestionarUsuarioBW)
        {
            this.gestionarUsuarioBW = gestionarUsuarioBW;
        }

        [HttpGet(Name = "ObtenerUsuarios")]
        public async Task<ActionResult<List<UsuarioGetDTO>>> Get()
        {
            try
            {
                var usuarios = await gestionarUsuarioBW.obtenerUsuarios();

                var usuariosDTO = usuarios.Select(UsuarioGetMapper.ToDTO).ToList();

                return Ok(usuariosDTO);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al obtener los usuarios: {ex.Message}");
            }
        }

        [HttpGet("{id}", Name = "ObtenerUsuarioPorId")]
        public async Task<ActionResult<UsuarioDTO>> Get(int id)
        {
            try
            {
                var usuario = await gestionarUsuarioBW.obtenerUsuarioPorId(id);
                if (usuario == null)
                    return NotFound("Usuario no encontrado");

                var usuarioDTO = UsuarioMapper.MapToDTO(usuario);

                return Ok(usuarioDTO);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al obtener el usuario: {ex.Message}");
            }
        }


        [HttpPost(Name = "RegistrarUsuario")]
        public async Task<ActionResult<bool>> Post([FromBody] UsuarioDTO usuarioDto)
        {
            try
            {
                var usuario = UsuarioMapper.MapToEntity(usuarioDto);
                var resultado = await gestionarUsuarioBW.registrarUsuario(usuario);

                if (!resultado)
                    return BadRequest("No se pudo registrar el usuario.");  // Devuelve error HTTP 400 si es false

                return Ok(true); // Devuelve HTTP 200 si se registró bien
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al registrar el usuario: {ex.Message}");
            }
        }

        [HttpPut("{id}", Name = "ActualizarUsuario")]
        public async Task<ActionResult<bool>> Put(int id, [FromBody] UsuarioActualizarDTO usuarioActualizarDto)
        {
            try
            {
                if (id != usuarioActualizarDto.id)
                    return BadRequest("El ID no coincide con el parámetro.");

                var resultado = await gestionarUsuarioBW.actualizarUsuario(id, usuarioActualizarDto);
                if (!resultado)
                    return NotFound("Usuario no encontrado o contraseña incorrecta");

                return Ok(true);
            }
            catch (System.Exception ex)
            {
                return BadRequest($"Error al actualizar el usuario: {ex.Message}");
            }
        }


        [HttpDelete("{id}", Name = "EliminarUsuario")]
        public async Task<ActionResult<bool>> Delete(int id)
        {
            try
            {
                var resultado = await gestionarUsuarioBW.eliminarUsuario(id);
                if (!resultado)
                    return NotFound("Usuario no encontrado");

                return Ok(true);
            }
            catch (System.Exception ex)
            {
                return BadRequest($"Error al eliminar el usuario: {ex.Message}");
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<UsuarioRespuestaDTO>> Login([FromBody] UsuarioLoginDTO loginDto)
        {
            try
            {
                var usuario = await gestionarUsuarioBW.ObtenerUsuarioPorCredenciales(loginDto.CorreoElectronico, loginDto.Contrasena);

                if (usuario == null)
                {
                    return Unauthorized("Credenciales incorrectas.");
                }

                // Usando el mapper para convertir Usuario a UsuarioRespuestaDTO
                var respuesta = UsuarioMapper.ToDTO(usuario);

                return Ok(respuesta);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al iniciar sesión: {ex.Message}");
            }
        }

        [HttpPut("admin/{id}", Name = "ActualizarUsuarioAdministrador")]
        public async Task<IActionResult> ActualizarUsuarioAdmin(int id, [FromBody] UsuarioActualizarAdminDTO usuarioDto)
        {
            var usuario = UsuarioMapper.MapToEntity(usuarioDto);
            usuario.Id = id;

            var resultado = await gestionarUsuarioBW.actualizarUsuarioAdmin(id, usuario);

            if (!resultado)
                return BadRequest("No se pudo actualizar el usuario.");

            return Ok("Usuario actualizado correctamente.");
        }

        [HttpGet("admin/{id}", Name = "ObtenerUsuarioAdministrador")]
        public async Task<ActionResult<UsuarioActualizarAdminDTO>> ObtenerUsuarioAdministrador(int id)
        {
            try
            {
                var usuario = await gestionarUsuarioBW.obtenerUsuarioPorId(id);
                if (usuario == null)
                    return NotFound("Usuario no encontrado");

                var usuarioDto = UsuarioMapper.ToActualizarAdminDTO(usuario);

                return Ok(usuarioDto);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al obtener el usuario: {ex.Message}");
            }
        }



    }

}

