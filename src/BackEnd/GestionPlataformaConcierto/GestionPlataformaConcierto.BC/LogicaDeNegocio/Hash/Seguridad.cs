using BCrypt.Net;

namespace GestionPlataformaConcierto.BC.LogicaDeNegocio.Hash
{
    public class Seguridad
    {
        // Método para hashear la contraseña
        public string HashearContrasena(string contrasena)
        {
            return BCrypt.Net.BCrypt.HashPassword(contrasena);
        }

        // Método para verificar contraseña
        public bool VerificarContrasena(string contrasenaIngresada, string hashGuardado)
        {
            return BCrypt.Net.BCrypt.Verify(contrasenaIngresada, hashGuardado);
        }
    }
}
