
using GestionPlataformaConcierto.BC.Modelos;
using GestionPlataformaConcierto.BC.ReglasDeNegocio;
using GestionPlataformaConcierto.BW.Interfaces.BW;
using GestionPlataformaConcierto.BW.Interfaces.DA;

namespace GestionPlataformaConcierto.BW.CU
{
    public class GestionarUsuarioBW : IGestionarUsuarioBW
    {
        private readonly IGestionarUsuarioDA gestionarUsuarioDA;

        public GestionarUsuarioBW(IGestionarUsuarioDA gestionarUsuarioDA)
        {
            this.gestionarUsuarioDA = gestionarUsuarioDA;
        }

        public Task<bool> actualizarUsuario(int id, Usuario usuario)
        {
            if (!ReglasDeUsuario.ElIdEsValido(id) || !ReglasDeUsuario.ElUsuarioEsValido(usuario))
            {
                return Task.FromResult(false);
            }
            return gestionarUsuarioDA.actualizarUsuario(id, usuario);
        }

        public Task<bool> eliminarUsuario(int id)
        {
            return ReglasDeUsuario.ElIdEsValido(id) 
                ? gestionarUsuarioDA.eliminarUsuario(id) 
                : Task.FromResult(false);
        }

        public Task<Usuario> ObtenerUsuarioPorCredenciales(string correoElectronico, string contrasena)
        {
            return ReglasDeUsuario.lasCredencialesSonValidas(correoElectronico, contrasena) 
                ? gestionarUsuarioDA.ObtenerUsuarioPorCredenciales(correoElectronico, contrasena) 
                : Task.FromResult<Usuario>(null);
        }

        public Task<Usuario> obtenerUsuarioPorId(int id)
        {
            return ReglasDeUsuario.ElIdEsValido(id) 
                ? gestionarUsuarioDA.obtenerUsuarioPorId(id) 
                : Task.FromResult<Usuario>(null);
        }

        public Task<List<Usuario>> obtenerUsuarios()
        {
           return gestionarUsuarioDA.obtenerUsuarios();
        }

        public Task<bool> registrarUsuario(Usuario usuario)
        {
            return ReglasDeUsuario.ElUsuarioEsValido(usuario)
                ? gestionarUsuarioDA.registrarUsuario(usuario)
                : Task.FromResult(false);
        }
    }
}
