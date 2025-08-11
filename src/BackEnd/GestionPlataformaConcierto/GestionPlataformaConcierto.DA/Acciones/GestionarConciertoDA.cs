using GestionPlataformaConcierto.BC.Modelos;
using GestionPlataformaConcierto.DA.Config;
using Microsoft.EntityFrameworkCore;
using GestionPlataformaConcierto.BC.LogicaDeNegocio.DTO;
using GestionPlataformaConcierto.BW.Interfaces.DA;

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

        // ===== INICIO DEL CÓDIGO NUEVO Y CORREGIDO =====
        public async Task<IEnumerable<SaleDetailDto>> GetSalesDetailsByConcertAsync(int concertId)
        {
            // NOTA: Asumimos que los nombres de las entidades en C# son iguales a los de las tablas en SQL.
            // Ej: Tabla 'Usuario' -> Entidad 'Usuario'.

            var salesDetails = await gestionDePlataformaContext.AsientoReserva
                // 1. Incluimos la Reserva a la que pertenece cada asiento
                .Include(ar => ar.Reserva)
                    // 2. Desde la Reserva, incluimos el Usuario que la hizo
                    .ThenInclude(r => r.Usuario)
                // 3. Incluimos también la Categoría de cada asiento
                .Include(ar => ar.CategoriaAsiento)
                // 4. Filtramos para obtener solo los asientos del concierto y estado correctos
                .Where(ar => ar.Reserva.ConciertoId == concertId && ar.Reserva.Estado == "Comprado")
                // 5. Proyectamos el resultado a nuestro DTO
                .Select(ar => new SaleDetailDto
                {
                    Comprador = ar.Reserva.Usuario.NombreCompleto,
                    FechaCompra = ar.Reserva.FechaHoraCompra ?? DateTime.MinValue, // Usamos la fecha de compra de la reserva
                    CategoriaAsiento = ar.CategoriaAsiento.Nombre,
                    Precio = ar.Precio // Usamos el precio guardado en el asiento de la reserva
                })
                .ToListAsync();

            return salesDetails;
        }
        // ===== FIN DEL CÓDIGO NUEVO Y CORREGIDO =====

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
                // Considera registrar el error 'ex' para depuración
                return false;
            }
        }
    }
}