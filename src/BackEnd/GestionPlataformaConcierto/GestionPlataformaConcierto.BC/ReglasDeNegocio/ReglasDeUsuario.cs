using System.Text.RegularExpressions;
using GestionPlataformaConcierto.BC.LogicaDeNegocio.Enum;
using GestionPlataformaConcierto.BC.Modelos;

namespace GestionPlataformaConcierto.BC.ReglasDeNegocio
{
    public class ReglasDeUsuario
    {

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
            if (!Enum.IsDefined(typeof(RolesPermitidos), usuario.Rol))
                return false;

            return true;
        }

        public static bool ElIdEsValido(int id)
        {
            return id > 0;
        }

        public static bool lasCredencialesSonValidas(string correoElectronico, string contrasena)
        {
            return !string.IsNullOrEmpty(correoElectronico) && 
                   !string.IsNullOrEmpty(contrasena) && 
                   correoElectronico.Contains("@") && 
                   contrasena.Length >= 8;
        }

    }
}
