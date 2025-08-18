using System;
using System.Collections.Generic;
using System.Linq;
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

                Venta = dto.Venta != null ? new Venta
                {
                    Id = dto.Venta.Id,
                    ConciertoId = dto.Id,
                    FechaFin = DateTime.Parse(dto.Venta.FechaFin),
                    Estado = dto.Venta.Estado,
                    Concierto = null
                } : null,

                Promociones = dto.Promociones != null
                    ? new List<Promocion>(dto.Promociones.Select(p => new Promocion
                    {
                        Id = p.Id,
                        Nombre = p.Nombre,
                        Descuento = p.Descuento,
                        Activa = p.Activa,
                        FechaFin = DateTime.Parse(p.FechaFin),
                        ConciertoId = dto.Id,
                        Concierto = null
                    }))
                    : new List<Promocion>()
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

                Venta = concierto.Venta != null ? new VentaDTO
                {
                    Id = concierto.Venta.Id,
                    ConciertoId = concierto.Venta.ConciertoId,
                    FechaFin = concierto.Venta.FechaFin.ToString("yyyy-MM-ddTHH:mm:ss"),
                    Estado = concierto.Venta.Estado
                } : null,

                Promociones = concierto.Promociones?.Select(p => new PromocionDTO
                {
                    Id = p.Id,
                    Nombre = p.Nombre,
                    Descuento = p.Descuento,
                    FechaFin = p.FechaFin.ToString("yyyy-MM-ddTHH:mm:ss"),
                    Activa = p.Activa,
                    ConciertoId = concierto.Id
                }).ToList() ?? new List<PromocionDTO>()
            };
        }
    }
}
