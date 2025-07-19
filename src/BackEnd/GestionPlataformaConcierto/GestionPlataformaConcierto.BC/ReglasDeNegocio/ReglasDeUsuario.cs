using System.Text.RegularExpressions;
using GestionPlataformaConcierto.BC.Modelos;

namespace GestionPlataformaConcierto.BC.ReglasDeNegocio
{
    public class ReglasDeUsuario
    {
        private static readonly List<string> RolesPermitos = new List<string>
        {
            "administrador",
            "promotor",
            "usuario"
        };

        public static bool ElUsuarioEsValido(Usuario usuario)
        {
            return ElNombreEsValido(usuario) &&
                   ElEmailEsValido(usuario) &&
                   LaContrasenaEsValida(usuario) &&
                   ElRolEsValido(usuario);
        }

        public static bool ElNombreEsValido(Usuario usuario)
        {
            return !string.IsNullOrEmpty(usuario.NombreCompleto) && usuario.NombreCompleto.Length >= 3 && usuario.NombreCompleto.Length <= 50;
        }

        public static bool ElEmailEsValido(Usuario usuario)
        {
            return !string.IsNullOrEmpty(usuario.CorreoElectronico) && usuario.CorreoElectronico.Contains("@");
        }

        public static bool LaContrasenaEsValida(Usuario usuario)
        {
            if (string.IsNullOrEmpty(usuario.Contrasena))
                return false;

            if (usuario.Contrasena.Length < 8)
                return false;

            // Al menos una mayúscula, un número y un símbolo
            var regex = new Regex(@"^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$");
            return regex.IsMatch(usuario.Contrasena);
        }

        public static bool ElRolEsValido(Usuario usuario)
        {
            return !string.IsNullOrEmpty(usuario.Rol.ToString()) && RolesPermitos.Contains(usuario.Rol.ToString().ToLower());
        }

        public static bool ElIdEsValido(int id)
        {
            return id > 0;
        }

    }
}
