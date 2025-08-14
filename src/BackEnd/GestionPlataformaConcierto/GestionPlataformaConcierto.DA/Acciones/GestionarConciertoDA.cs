using GestionPlataformaConcierto.BC.LogicaDeNegocio.DTO;
using GestionPlataformaConcierto.BC.LogicaDeNegocio.Enum;
using GestionPlataformaConcierto.BC.Modelos;
using GestionPlataformaConcierto.BC.ReglasDeNegocio;
using GestionPlataformaConcierto.BW.CU;
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
            // Cargar el concierto existente con las colecciones relacionadas
            var conciertoExistente = await gestionDePlataformaContext.Concierto
                .Include(c => c.CategoriasAsiento)
                .Include(c => c.ArchivosMultimedia)
                .Include(c => c.Venta) 
                .FirstOrDefaultAsync(c => c.Id == id);

            if (conciertoExistente == null)
                return false;

            // Actualizar campos simples
            conciertoExistente.Nombre = concierto.Nombre;
            conciertoExistente.Descripcion = concierto.Descripcion;
            conciertoExistente.Fecha = concierto.Fecha;
            conciertoExistente.Lugar = concierto.Lugar;
            conciertoExistente.Capacidad = concierto.Capacidad;

            // --- Actualizar CategoriasAsiento ---
            foreach (var categoriaExistente in conciertoExistente.CategoriasAsiento.ToList())
            {
                if (!concierto.CategoriasAsiento.Any(c => c.Id == categoriaExistente.Id))
                    gestionDePlataformaContext.CategoriaAsiento.Remove(categoriaExistente);
            }

            foreach (var categoriaNueva in concierto.CategoriasAsiento)
            {
                var categoriaExistente = conciertoExistente.CategoriasAsiento
                    .FirstOrDefault(c => c.Id == categoriaNueva.Id);

                if (categoriaExistente != null)
                {
                    categoriaExistente.Nombre = categoriaNueva.Nombre;
                    categoriaExistente.Precio = categoriaNueva.Precio;
                    categoriaExistente.CantidadAsientos = categoriaNueva.CantidadAsientos;
                }
                else
                {
                    conciertoExistente.CategoriasAsiento.Add(categoriaNueva);
                }
            }

            // --- Actualizar ArchivosMultimedia ---
            foreach (var archivoExistente in conciertoExistente.ArchivosMultimedia.ToList())
            {
                if (!concierto.ArchivosMultimedia.Any(a => a.Id == archivoExistente.Id))
                    gestionDePlataformaContext.ArchivoMultimedia.Remove(archivoExistente);
            }

            foreach (var archivoNuevo in concierto.ArchivosMultimedia)
            {
                var archivoExistente = conciertoExistente.ArchivosMultimedia
                    .FirstOrDefault(a => a.Id == archivoNuevo.Id);

                if (archivoExistente != null)
                {
                    archivoExistente.NombreArchivo = archivoNuevo.NombreArchivo;
                    archivoExistente.Contenido = archivoNuevo.Contenido;
                    archivoExistente.Tipo = archivoNuevo.Tipo;
                }
                else
                {
                    conciertoExistente.ArchivosMultimedia.Add(archivoNuevo);
                }
            }

            // --- Actualizar Venta ---
            if (concierto.Venta != null)
            {
                if (conciertoExistente.Venta != null)
                {
                    
                    conciertoExistente.Venta.FechaFin = concierto.Venta.FechaFin;
                    conciertoExistente.Venta.Estado = concierto.Venta.Estado;
                }
                else
                {
                    
                    conciertoExistente.Venta = new Venta
                    {
                        FechaFin = concierto.Venta.FechaFin,
                        Estado = concierto.Venta.Estado,
                        ConciertoId = conciertoExistente.Id
                    };
                }
            }

            await gestionDePlataformaContext.SaveChangesAsync();

            return true;
        }

        public async Task<bool> cambiarEstadoVenta(int idConcierto)
        {
            var concierto = gestionDePlataformaContext.Concierto
                .Include(c => c.Venta)
                .FirstOrDefault(c => c.Id == idConcierto);

            if (concierto == null || concierto.Venta == null)
                return false;

            concierto.Venta.Estado = concierto.Venta.Estado == EstadoVenta.Activo? EstadoVenta.Inactivo: EstadoVenta.Activo;

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
            
            var ventas = await gestionDePlataformaContext.Venta
                .Where(v => v.ConciertoId == id)
                .ToListAsync();

            if (ventas.Any())
                gestionDePlataformaContext.Venta.RemoveRange(ventas);

            
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
                    FechaCompra = DateTime.MinValue, // Usamos la fecha de compra de la reserva
                    CategoriaAsiento = ar.CategoriaAsiento.Nombre,
                    Precio = ar.Precio // Usamos el precio guardado en el asiento de la reserva
                })
                .ToListAsync();

            return salesDetails;
        }
        // ===== FIN DEL CÓDIGO NUEVO Y CORREGIDO =====

        public async Task<Concierto> obtenerConciertoPorId(int id)
        {
            var concierto = await gestionDePlataformaContext.Concierto
                .Include(c => c.CategoriasAsiento)
                .Include(c => c.ArchivosMultimedia)
                .Include(c => c.Venta)
                .FirstOrDefaultAsync(c => c.Id == id);

            // Desactivar venta si ya pasó la fecha
            if (concierto?.Venta != null && concierto.Venta.Estado == EstadoVenta.Activo)
            {
                if (concierto.Venta.FechaFin <= DateTime.Now)
                {
                    concierto.Venta.Estado = EstadoVenta.Finalizado;
                    await gestionDePlataformaContext.SaveChangesAsync();
                }
            }

            return concierto;
        }

        public async Task<List<Concierto>> obtenerConciertos()
        {
            var conciertos = await gestionDePlataformaContext.Concierto
                .Include(c => c.CategoriasAsiento)
                .Include(c => c.ArchivosMultimedia)
                .Include(c => c.Venta)
                .ToListAsync();

            // Update para todos los conciertos
            foreach (var c in conciertos)
            {
                if (c.Venta != null && c.Venta.Estado == EstadoVenta.Activo && c.Venta.FechaFin <= DateTime.Now)
                {
                    c.Venta.Estado = EstadoVenta.Finalizado;
                }
            }

            await gestionDePlataformaContext.SaveChangesAsync();
            return conciertos;
        }

        public async Task<List<Concierto>> ObtenerConciertosPorUsuario(int idUsuario)
        {
            var conciertos = await gestionDePlataformaContext.Concierto
                .Where(c => c.UsuarioID == idUsuario)
                .Include(c => c.CategoriasAsiento)
                .Include(c => c.ArchivosMultimedia)
                .Include(c => c.Venta)
                .ToListAsync();

            foreach (var c in conciertos)
            {
                if (c.Venta != null && c.Venta.Estado == EstadoVenta.Activo && c.Venta.FechaFin <= DateTime.Now)
                {
                    c.Venta.Estado = EstadoVenta.Finalizado;
                }
            }

            await gestionDePlataformaContext.SaveChangesAsync();
            return conciertos;
        }


        public Task<List<Venta>> ObtenerVentaPorConcierto(int idConcierto)
        {
            throw new NotImplementedException();
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


