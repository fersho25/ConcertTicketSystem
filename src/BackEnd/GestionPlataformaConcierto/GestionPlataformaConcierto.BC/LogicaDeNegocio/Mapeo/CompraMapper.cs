using GestionPlataformaConcierto.BC.DTOs;
using GestionPlataformaConcierto.BC.LogicaDeNegocio.DTO;
using GestionPlataformaConcierto.BC.Modelos;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GestionPlataformaConcierto.BC.LogicaDeNegocio.Mapeo
{
    public static class CompraMapper
    {
        public static Compra MapToEntity(CompraDTO dto)
        {
            return new Compra
            {
                Id = dto.Id,
                ReservaId = dto.ReservaId,
                MetodoPago = dto.MetodoPago,
                FechaHoraCompra = dto.FechaHoraCompra,
                PrecioTotal = dto.PrecioTotal,
                DescuentoAplicado = dto.DescuentoAplicado,
                PromocionAplicada = dto.PromocionAplicada,
                CodigoQR = dto.CodigoQR,
                Notificado = dto.Notificado,
                Estado = dto.Estado,

                Reserva = dto.Reserva != null
                    ? new Reserva
                    {
                        UsuarioId = dto.Reserva.UsuarioId,
                        ConciertoId = dto.Reserva.ConciertoId,
                        FechaHoraReserva = dto.Reserva.FechaHoraReserva,
                        FechaHoraExpiracion = dto.Reserva.FechaHoraExpiracion,
                        Estado = dto.Reserva.Estado,
                        Asientos = dto.Reserva.Asientos?.Select(a => new AsientoReserva
                        {
                            CategoriaAsientoId = a.CategoriaAsientoId,
                            NumeroAsiento = a.NumeroAsiento,
                            Precio = a.Precio
                        }).ToList() ?? new List<AsientoReserva>()
                    }
                    : null,

                Asientos = dto.Asientos?.Select(a => new AsientoReserva
                {
                    CategoriaAsientoId = a.CategoriaAsientoId,
                    NumeroAsiento = a.NumeroAsiento,
                    Precio = a.Precio
                }).ToList() ?? new List<AsientoReserva>()
            };
        }

        public static CompraDTO MapToDTO(Compra compra)
        {
            return new CompraDTO
            {
                Id = compra.Id,
                ReservaId = compra.ReservaId,
                MetodoPago = compra.MetodoPago,
                FechaHoraCompra = compra.FechaHoraCompra,
                PrecioTotal = compra.PrecioTotal,
                DescuentoAplicado = compra.DescuentoAplicado,
                PromocionAplicada = compra.PromocionAplicada,
                CodigoQR = compra.CodigoQR,
                Notificado = compra.Notificado,
                Estado = compra.Estado,

                Reserva = compra.Reserva != null
                    ? new ReservaDTO
                    {
                        UsuarioId = compra.Reserva.UsuarioId,
                        ConciertoId = compra.Reserva.ConciertoId,
                        FechaHoraReserva = compra.Reserva.FechaHoraReserva,
                        FechaHoraExpiracion = compra.Reserva.FechaHoraExpiracion,
                        Estado = compra.Reserva.Estado,
                        Asientos = compra.Reserva.Asientos?.Select(a => new AsientoReservaDTO
                        {
                            CategoriaAsientoId = a.CategoriaAsientoId,
                            NumeroAsiento = a.NumeroAsiento,
                            Precio = a.Precio
                        }).ToList() ?? new List<AsientoReservaDTO>()
                    }
                    : null,

                Asientos = compra.Asientos?.Select(a => new AsientoReservaDTO
                {
                    CategoriaAsientoId = a.CategoriaAsientoId,
                    NumeroAsiento = a.NumeroAsiento,
                    Precio = a.Precio
                }).ToList() ?? new List<AsientoReservaDTO>()
            };
        }
    }
}
