﻿
using GestionPlataformaConcierto.BC.Modelos;
using GestionPlataformaConcierto.BW.Interfaces.DA;
using GestionPlataformaConcierto.DA.Config;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace GestionPlataformaConcierto.DA.Acciones
{
    public class GestionarUsuarioDA : IGestionarUsuarioDA
    {
        private readonly GestionDePlataformaContext gestionDePlataformaContext;

        public GestionarUsuarioDA(GestionDePlataformaContext gestionDePlataformaContext)
        {
            this.gestionDePlataformaContext = gestionDePlataformaContext;
        }

        public async Task<bool> actualizarUsuario(int id, Usuario usuario)
        {
            Usuario usuarioExistente = await gestionDePlataformaContext.Usuario.FindAsync(id);
            
            if (usuarioExistente == null)
                return false;

            usuarioExistente.NombreCompleto = usuario.NombreCompleto;
            usuarioExistente.CorreoElectronico = usuario.CorreoElectronico;
            usuarioExistente.Contrasena = usuario.Contrasena;
            usuarioExistente.Rol = usuario.Rol;
            usuarioExistente.ConciertosCreados = usuario.ConciertosCreados;

            await gestionDePlataformaContext.SaveChangesAsync();

            return true;

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

        public async Task<Usuario> ObtenerUsuarioPorCredenciales(string correoElectronico, string contrasena)
        {
            return await gestionDePlataformaContext.Usuario.FirstOrDefaultAsync(u => u.CorreoElectronico == correoElectronico && u.Contrasena == contrasena);
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
                var correoExiste = await gestionDePlataformaContext.Usuario.AnyAsync(u => u.CorreoElectronico == usuario.CorreoElectronico);
                if (correoExiste) return false;

                gestionDePlataformaContext.Usuario.Add(usuario);

                await gestionDePlataformaContext.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
}
