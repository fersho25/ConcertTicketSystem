
using GestionPlataformaConcierto.BC.LogicaDeNegocio.DTO;
using GestionPlataformaConcierto.BC.LogicaDeNegocio.Hash;
using GestionPlataformaConcierto.BC.Modelos;
using GestionPlataformaConcierto.BW.Interfaces.DA;
using GestionPlataformaConcierto.DA.Config;
using Microsoft.EntityFrameworkCore;

namespace GestionPlataformaConcierto.DA.Acciones
{
    public class GestionarUsuarioDA : IGestionarUsuarioDA
    {
        private readonly GestionDePlataformaContext gestionDePlataformaContext;
        private Seguridad seguridad;
        public GestionarUsuarioDA(GestionDePlataformaContext gestionDePlataformaContext, Seguridad seguridad)
        {
            this.gestionDePlataformaContext = gestionDePlataformaContext;
            this.seguridad = seguridad;
        }

      

        public async Task<bool> actualizarUsuario(int id, UsuarioActualizarDTO usuario)
        {
            var usuarioExistente = await gestionDePlataformaContext.Usuario.FindAsync(id);

            if (usuarioExistente == null)
                return false;

            if (!string.IsNullOrEmpty(usuario.ContrasenaActual))
            {
                if (!BCrypt.Net.BCrypt.Verify(usuario.ContrasenaActual, usuarioExistente.Contrasena))
                {
                    return false;
                }
            }


            usuarioExistente.NombreCompleto = usuario.NombreCompleto;
            usuarioExistente.CorreoElectronico = usuario.CorreoElectronico;
            usuarioExistente.Rol = usuario.Rol;


            if (!string.IsNullOrEmpty(usuario.ContrasenaNueva))
            {
                usuarioExistente.Contrasena = seguridad.HashearContrasena(usuario.ContrasenaNueva);
            }

            await gestionDePlataformaContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> actualizarUsuarioAdmin(int id, Usuario usuario)
        {
            try
            {
                var usuarioExistente = await gestionDePlataformaContext.Usuario.FindAsync(id);
                if (usuarioExistente == null) return false;

                usuarioExistente.NombreCompleto = usuario.NombreCompleto;
                usuarioExistente.CorreoElectronico = usuario.CorreoElectronico;
                usuarioExistente.Rol = usuario.Rol;

                await gestionDePlataformaContext.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<bool> CambiarContrasena(string correoElectronico, string nuevaContrasena)
        {
            try
            {
                var usuario = await gestionDePlataformaContext.Usuario
                    .FirstOrDefaultAsync(u => u.CorreoElectronico == correoElectronico);

                if (usuario == null)
                    return false;

               
                usuario.Contrasena = seguridad.HashearContrasena(nuevaContrasena);

                await gestionDePlataformaContext.SaveChangesAsync();

                return true;
            }
            catch (Exception)
            {
                return false;
            }

        }

        public async Task<bool> eliminarUsuario(int id)
        {
            var usuario = await gestionDePlataformaContext.Usuario
                                .Include(u => u.ConciertosCreados)
                                    .ThenInclude(c => c.CategoriasAsiento)
                                .Include(u => u.ConciertosCreados)
                                    .ThenInclude(c => c.ArchivosMultimedia)
                                .FirstOrDefaultAsync(u => u.Id == id);

            if (usuario == null)
                return false;

            foreach (var concierto in usuario.ConciertosCreados)
            {
                gestionDePlataformaContext.CategoriaAsiento.RemoveRange(concierto.CategoriasAsiento);
                gestionDePlataformaContext.ArchivoMultimedia.RemoveRange(concierto.ArchivosMultimedia);
            }

            gestionDePlataformaContext.Concierto.RemoveRange(usuario.ConciertosCreados);
            gestionDePlataformaContext.Usuario.Remove(usuario);

            await gestionDePlataformaContext.SaveChangesAsync();
            return true;
        }

        public async Task<Usuario> ObtenerUsuarioAdministrador(int id)
        {
      
           
            return await gestionDePlataformaContext.Usuario.FirstOrDefaultAsync(u => u.Id == id);
            
        }

        public async Task<Usuario> ObtenerUsuarioPorCredenciales(string correoElectronico, string contrasena)
        {
            var usuario = await gestionDePlataformaContext.Usuario
                .FirstOrDefaultAsync(u => u.CorreoElectronico == correoElectronico);

            if (usuario == null)
                return null;

            bool esValida = seguridad.VerificarContrasena(contrasena, usuario.Contrasena);

            if (esValida)
                return usuario;

            return null;
        }



        public async Task<Usuario> obtenerUsuarioPorId(int id)
        {
            return await gestionDePlataformaContext.Usuario
                 .Include(u => u.ConciertosCreados)
                     .ThenInclude(c => c.CategoriasAsiento)
                 .Include(u => u.ConciertosCreados)
                     .ThenInclude(c => c.ArchivosMultimedia)
                 .FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<List<Usuario>> obtenerUsuarios()
        {
            return await gestionDePlataformaContext.Usuario
                   .Include(u => u.ConciertosCreados)
                 .ThenInclude(c => c.CategoriasAsiento)
                .Include(u => u.ConciertosCreados)
                .ThenInclude(c => c.ArchivosMultimedia)
                .ToListAsync();
        }

        public async Task<bool> registrarUsuario(Usuario usuario)
        {
            try
            {
                var correoExiste = await gestionDePlataformaContext.Usuario
                    .AnyAsync(u => u.CorreoElectronico == usuario.CorreoElectronico);

                if (correoExiste) return false;

               
                usuario.Contrasena = seguridad.HashearContrasena(usuario.Contrasena);

                gestionDePlataformaContext.Usuario.Add(usuario);
                await gestionDePlataformaContext.SaveChangesAsync();

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}
