using GestionPlataformaConcierto.BC.LogicaDeNegocio.DTO;

namespace GestionPlataformaConcierto.BC.DTOs
{
    public class CompraDTO
    {
        public int Id { get; set; }
        public int ReservaId { get; set; }

        public ReservaDTO Reserva { get; set; }

        public List<AsientoReservaDTO> Asientos { get; set; }

        public string MetodoPago { get; set; }
        public DateTime? FechaHoraCompra { get; set; }
        public decimal PrecioTotal { get; set; }
        public decimal DescuentoAplicado { get; set; }
        public string PromocionAplicada { get; set; }
        public string CodigoQR { get; set; }
        public bool Notificado { get; set; }
        public string Estado { get; set; }
    }
}
