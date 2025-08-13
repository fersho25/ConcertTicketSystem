using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GestionPlataformaConcierto.BC.LogicaDeNegocio.DTO;
using GestionPlataformaConcierto.BC.Modelos;

namespace GestionPlataformaConcierto.BC.LogicaDeNegocio.Mapeo
{
    public static class ConciertoMapper
    {
        public static Concierto MapToEntity(ConciertoDTO dto)
        {
            return new Concierto
            {
                Id = dto.Id,
                Nombre = dto.Nombre,
                Descripcion = dto.Descripcion,
                Fecha = dto.Fecha,
                Lugar = dto.Lugar,
                Capacidad = dto.Capacidad,
                UsuarioID = dto.UsuarioID,
                CategoriasAsiento = dto.CategoriasAsiento?.Select(ca => new CategoriaAsiento
                {
                    Id = ca.Id,
                    Nombre = ca.Nombre,
                    Precio = ca.Precio,
                    CantidadAsientos = ca.Cantidad,
                    ConciertoId = ca.ConciertoId,
                    Concierto = null
                }).ToList() ?? new List<CategoriaAsiento>(),
                ArchivosMultimedia = dto.ArchivosMultimedia?.Select(am => new ArchivoMultimedia
                {
                    Id = am.Id,
                    Contenido = Convert.FromBase64String(
                        am.Contenido.Contains(",")
                            ? am.Contenido.Substring(am.Contenido.IndexOf(",") + 1).Trim()
                            : am.Contenido
                    ),
                    NombreArchivo = am.NombreArchivo,
                    Tipo = am.Tipo,
                    ConciertoId = am.ConciertoId,
                    Concierto = null
                }).ToList() ?? new List<ArchivoMultimedia>(),

                // Aquí agregar:
                Venta = dto.Venta?.Select(v => new Venta
                {
                    Id = v.Id,
                    ConciertoId = v.ConciertoId,
                    FechaInicio = DateTime.Parse(v.FechaInicio),
                    FechaFin = DateTime.Parse(v.FechaFin),
                    Estado = v.Estado,
                    Concierto = null
                }).ToList() ?? new List<Venta>()
            };
        }

        public static ConciertoDTO MapToDTO(Concierto concierto)
        {
            return new ConciertoDTO
            {
                Id = concierto.Id,
                Nombre = concierto.Nombre,
                Descripcion = concierto.Descripcion,
                Fecha = concierto.Fecha,
                Lugar = concierto.Lugar,
                Capacidad = concierto.Capacidad,
                UsuarioID = concierto.UsuarioID,
                CategoriasAsiento = concierto.CategoriasAsiento?.Select(ca => new CategoriaAsientoDTO
                {
                    Id = ca.Id,
                    Nombre = ca.Nombre,
                    Precio = ca.Precio,
                    Cantidad = ca.CantidadAsientos,
                    ConciertoId = ca.ConciertoId
                }).ToList() ?? new List<CategoriaAsientoDTO>(),
                ArchivosMultimedia = concierto.ArchivosMultimedia?.Select(am => new ArchivoMultimediaDTO
                {
                    Id = am.Id,
                    Contenido = Convert.ToBase64String(am.Contenido),
                    NombreArchivo = am.NombreArchivo,
                    Tipo = am.Tipo,
                    ConciertoId = am.ConciertoId
                }).ToList() ?? new List<ArchivoMultimediaDTO>(),

                // Aquí agregar:
                Venta = concierto.Venta?.Select(v => new VentaDTO
                {
                    Id = v.Id,
                    ConciertoId = v.ConciertoId,
                    FechaInicio = v.FechaInicio.ToString("o"), // ISO 8601
                    FechaFin = v.FechaFin.ToString("o"),
                    Estado = v.Estado
                }).ToList() ?? new List<VentaDTO>()
            };
        }


    }
}
