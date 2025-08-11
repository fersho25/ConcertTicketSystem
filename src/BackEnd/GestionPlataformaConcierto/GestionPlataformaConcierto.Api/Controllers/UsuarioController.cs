using GestionPlataformaConcierto.BC.LogicaDeNegocio.DTO;
using GestionPlataformaConcierto.BC.LogicaDeNegocio.Mapeo;
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
        public async Task<ActionResult<UsuarioGetDTO>> Get(int id)
        {
            try
            {
                var usuario = await gestionarUsuarioBW.obtenerUsuarioPorId(id);
                if (usuario == null)
                    return NotFound("Usuario no encontrado");

                var usuarioDTO = UsuarioGetMapper.ToDTO(usuario);

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
        public async Task<ActionResult<bool>> Put(int id, [FromBody] UsuarioDTO usuarioDto)
        {
            try
            {
                if (id != usuarioDto.Id)
                    return BadRequest("El ID no coincide con el parámetro.");


                var usuario = UsuarioMapper.MapToEntity(usuarioDto);

                var resultado = await gestionarUsuarioBW.actualizarUsuario(id, usuario);
                if (!resultado)
                    return NotFound("Usuario no encontrado");

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

    }

}

