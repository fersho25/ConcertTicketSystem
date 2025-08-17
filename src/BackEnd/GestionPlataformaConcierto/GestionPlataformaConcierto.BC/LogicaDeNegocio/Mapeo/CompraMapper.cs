using GestionPlataformaConcierto.BC.DTOs;
using GestionPlataformaConcierto.BC.LogicaDeNegocio.DTO;
using GestionPlataformaConcierto.BC.Modelos;
using GestionPlataformaConcierto.BC.ReglasDeNegocio;
using System.Collections.Generic;
using System.Linq;

public static class CompraMapper
{
    public static Compra MapToEntity(CompraDTO dto, Reserva reserva)
    {
        if (reserva == null)
            throw new ArgumentNullException(nameof(reserva));

        var compra = new Compra
        {
            ReservaId = reserva.Id,
            MetodoPago = dto.MetodoPago,
            FechaHoraCompra = dto.FechaHoraCompra != default ? dto.FechaHoraCompra : DateTime.Now,
            PromocionAplicada = dto.PromocionAplicada,
            Estado = dto.Estado,
            Notificado = dto.Notificado,
            Asientos = new List<AsientoReserva>() // inicializamos vacío
        };

        compra.Asientos = new List<AsientoReserva>();

        // Ahora agregamos los asientos y asignamos la referencia a la compra
        if (reserva.Asientos != null)
        {
            foreach (var asiento in reserva.Asientos)
            {
                compra.Asientos.Add(new AsientoReserva
                {
                    CategoriaAsientoId = asiento.CategoriaAsientoId,
                    NumeroAsiento = asiento.NumeroAsiento,
                    Precio = asiento.Precio,
                    ReservaId = reserva.Id,
                    Compra = compra
                });
            }
        }


        // Calcular precio total usando las reglas
        compra.PrecioTotal = ReglasDeCompra.CalcularPrecioTotal(compra);

        return compra;
    }


    public static Compra MapToEntity(CompraDTO dto)
    {
        return new Compra
        {
            Id = dto.Id,
            ReservaId = dto.ReservaId,
            MetodoPago = dto.MetodoPago,
            FechaHoraCompra = dto.FechaHoraCompra, // Asegúrate que en Compra sea DateTime y no nullable
            PrecioTotal = dto.PrecioTotal,
            DescuentoAplicado = dto.DescuentoAplicado,
            PromocionAplicada = dto.PromocionAplicada,
            CodigoQR = dto.CodigoQR,
            Notificado = dto.Notificado,
            Estado = dto.Estado
        };
    }

    public static CompraDTO MapToDTO(Compra compra)
    {
        return new CompraDTO
        {
            Id = compra.Id,
            ReservaId = compra.ReservaId,
            MetodoPago = compra.MetodoPago ?? string.Empty,
            FechaHoraCompra = (DateTime)compra.FechaHoraCompra, // Igual, asegúrate que no sea nullable en Compra
            PrecioTotal = compra.PrecioTotal,
            DescuentoAplicado = compra.DescuentoAplicado,
            PromocionAplicada = compra.PromocionAplicada ?? string.Empty,
            CodigoQR = compra.CodigoQR ?? string.Empty,
            Notificado = compra.Notificado,
            Estado = compra.Estado ?? string.Empty
        };
    }


}

