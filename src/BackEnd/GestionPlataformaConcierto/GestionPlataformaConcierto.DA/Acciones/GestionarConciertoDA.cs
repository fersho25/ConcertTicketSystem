using GestionPlataformaConcierto.BC.Modelos;
using GestionPlataformaConcierto.BW.Interfaces.DA;
using GestionPlataformaConcierto.DA.Config;
using Microsoft.EntityFrameworkCore;

namespace GestionPlataformaConcierto.DA.Acciones
{
    public class GestionarConciertoDA : IGestionarConciertoDA
    {
        private readonly GestionDePlataformaContext gestionDePlataformaContext;

        public GestionarConciertoDA(GestionDePlataformaContext gestionDePlataformaContext)
        {
            this.gestionDePlataformaContext = gestionDePlataformaContext;
        }

        public async Task<bool> actualizarConcierto(int id, Concierto concierto)
        {
            Concierto conciertoExistente = await gestionDePlataformaContext.Concierto.FindAsync(id);

            if (conciertoExistente == null)
                return false;

            conciertoExistente.Nombre = concierto.Nombre;
            conciertoExistente.Descripcion = concierto.Descripcion;
            conciertoExistente.Fecha = concierto.Fecha;
            conciertoExistente.Lugar = concierto.Lugar;
            conciertoExistente.Capacidad = concierto.Capacidad;
            conciertoExistente.CategoriasAsiento = concierto.CategoriasAsiento;
            conciertoExistente.ArchivosMultimedia = concierto.ArchivosMultimedia;

            await gestionDePlataformaContext.SaveChangesAsync();
            return true;

        }

        public async Task<bool> eliminarArchivoMultimedia(int id)
        {
            var archivo = await gestionDePlataformaContext.ArchivoMultimedia.FindAsync(id);
            if (archivo == null)
                return false;

            gestionDePlataformaContext.ArchivoMultimedia.Remove(archivo);
            await gestionDePlataformaContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> eliminarCategoriaAsiento(int id)
        {
            var categoria = await gestionDePlataformaContext.CategoriaAsiento.FindAsync(id);
            if (categoria == null)
                return false;

            gestionDePlataformaContext.CategoriaAsiento.Remove(categoria);
            await gestionDePlataformaContext.SaveChangesAsync();
            return true;
        }
        public async Task<bool> eliminarConcierto(int id)
        {
            var concierto = await gestionDePlataformaContext.Concierto
                .Include(c => c.CategoriasAsiento)
                .Include(c => c.ArchivosMultimedia)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (concierto == null)
                return false;

            gestionDePlataformaContext.Concierto.Remove(concierto);
            await gestionDePlataformaContext.SaveChangesAsync();

            return true;
        }


        public async Task<Concierto> obtenerConciertoPorId(int id)
        {
            return await gestionDePlataformaContext.Concierto.Include(r => r.CategoriasAsiento).Include(r => r.ArchivosMultimedia).FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<List<Concierto>> obtenerConciertos()
        {
            return await gestionDePlataformaContext.Concierto.Include(r => r.CategoriasAsiento).Include(r => r.ArchivosMultimedia).ToListAsync();
        }

        public async Task<bool> registrarConcierto(Concierto concierto)
        {
            try
            {
                gestionDePlataformaContext.Concierto.Add(concierto);

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
