using GestionPlataformaConcierto.BC.LogicaDeNegocio.DTO;
using GestionPlataformaConcierto.BC.Modelos;

namespace GestionPlataformaConcierto.BC.LogicaDeNegocio.Mapeo
{
    public class AsientoReservaGetMapper
    {
        public static AsientoReservaGetDTO ToAsientoReservaGetDTO(AsientoReserva asiento)
        {
            return new AsientoReservaGetDTO
            {
                CategoriaAsientoId = asiento.CategoriaAsientoId,
                CategoriaNombre = asiento.CategoriaAsiento?.Nombre ?? "Desconocido",
                NumeroAsiento = asiento.NumeroAsiento,
                Precio = asiento.Precio,
                Estado = asiento.Estado.ToString()
            };
        }
    }
}
