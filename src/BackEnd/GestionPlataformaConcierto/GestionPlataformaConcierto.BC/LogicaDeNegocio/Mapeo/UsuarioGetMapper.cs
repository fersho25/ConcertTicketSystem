
using GestionPlataformaConcierto.BC.LogicaDeNegocio.DTO;
using GestionPlataformaConcierto.BC.Modelos;

namespace GestionPlataformaConcierto.BC.LogicaDeNegocio.Mapeo
{
    public class UsuarioGetMapper
    {
        public static UsuarioGetDTO ToDTO(Usuario usuario)
        {
            if (usuario == null) return null;

            return new UsuarioGetDTO
            {
                Id = usuario.Id,
                NombreCompleto = usuario.NombreCompleto,
                CorreoElectronico = usuario.CorreoElectronico,
                Rol = usuario.Rol,
                ConciertosCreados = usuario.ConciertosCreados?.Select(ConciertoMapper.MapToDTO).ToList() ?? new List<ConciertoDTO>()
            };
        }
    }
}
