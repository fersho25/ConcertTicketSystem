namespace GestionPlataformaConcierto.BC.Modelos
{
    public class Compra
    {
        public int Id { get; set; }
        public int ReservaId { get; set; }
        public Reserva Reserva { get; set; }
        public List<AsientoReserva> Asientos { get; set; } = new List<AsientoReserva>();
        public string MetodoPago { get; set; }
        public DateTime? FechaHoraCompra { get; set; }
        public decimal PrecioTotal { get; set; }
        public decimal DescuentoAplicado { get; set; }
        public string? PromocionAplicada { get; set; }
        public string? CodigoQR { get; set; }
        public bool Notificado { get; set; }
        public string? Estado { get; set; }

    }
}
