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
           
    }
}
