namespace GestionPlataformaConcierto.BC.Modelos
{
    public class Reserva
    {
        public int Id { get; set; }
        public int UsuarioId { get; set; }
        public Usuario Usuario { get; set; }
        public int ConciertoId { get; set; }
        public Concierto Concierto { get; set; }
        public List<AsientoReserva> Asientos { get; set; }
        public DateTime FechaHoraReserva { get; set; }
        public DateTime FechaHoraExpiracion { get; set; }
        public string Estado { get; set; }
        public string MetodoPago { get; set; } 
        public DateTime? FechaHoraCompra { get; set; }
        public decimal PrecioTotal { get; set; }
        public decimal DescuentoAplicado { get; set; }
        public string PromocionAplicada { get; set; }
        public string CodigoQR { get; set; } 
        public bool Notificado { get; set; }
           
    }
}
