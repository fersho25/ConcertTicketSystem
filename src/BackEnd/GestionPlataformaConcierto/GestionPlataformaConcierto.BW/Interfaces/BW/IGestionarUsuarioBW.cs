
using GestionPlataformaConcierto.BC.LogicaDeNegocio.DTO;
using GestionPlataformaConcierto.BC.Modelos;

namespace GestionPlataformaConcierto.BW.Interfaces.BW
{
    public interface IGestionarUsuarioBW
    {
        Task<bool> registrarUsuario(Usuario usuario);
        Task<bool> actualizarUsuario(int id, UsuarioActualizarDTO usuario);

        Task<bool> actualizarUsuarioAdmin(int id, Usuario usuario);
        Task<bool> eliminarUsuario(int id);
        Task<bool> CambiarContrasena(string correoElectronico, string nuevaContrasena);
        Task<List<Usuario>> obtenerUsuarios();
        Task<Usuario> obtenerUsuarioPorId(int id);
        Task<Usuario> ObtenerUsuarioAdministrador(int id);

        Task<Usuario> ObtenerUsuarioPorCredenciales(string correoElectronico, string contrasena);
    }
}
