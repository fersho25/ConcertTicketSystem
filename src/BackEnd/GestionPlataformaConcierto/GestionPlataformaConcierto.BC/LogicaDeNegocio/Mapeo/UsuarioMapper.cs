using GestionPlataformaConcierto.BC.LogicaDeNegocio.DTO;
using GestionPlataformaConcierto.BC.Modelos;

namespace GestionPlataformaConcierto.BC.LogicaDeNegocio.Mapeo
{
    public class UsuarioMapper
    {
        public static Usuario MapToEntity(UsuarioDTO dto)
        {
            return new Usuario
            {
                Id = dto.Id,
                NombreCompleto = dto.NombreCompleto,
                CorreoElectronico = dto.CorreoElectronico,
                Contrasena = dto.Contrasena,
                Rol = dto.Rol
            };
        }

        public static UsuarioDTO MapToDTO(Usuario entity)
        {
            return new UsuarioDTO
            {
                Id = entity.Id,
                NombreCompleto = entity.NombreCompleto,
                CorreoElectronico = entity.CorreoElectronico,
                Contrasena = entity.Contrasena,
                Rol = entity.Rol
            };
        }

        public static UsuarioRespuestaDTO ToDTO(Usuario usuario)
        {
            return new UsuarioRespuestaDTO
            {
                Id = usuario.Id,
                NombreCompleto = usuario.NombreCompleto,
                CorreoElectronico = usuario.CorreoElectronico,
                Rol = usuario.Rol
            };
        }


    }
}
