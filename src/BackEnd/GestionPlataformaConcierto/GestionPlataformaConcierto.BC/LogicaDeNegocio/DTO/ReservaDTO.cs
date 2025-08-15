namespace GestionPlataformaConcierto.BC.LogicaDeNegocio.DTO
{
    public class ReservaDTO
    {
        public int Id { get; set; }
        public int UsuarioId { get; set; }
        public int ConciertoId { get; set; }
        public DateTime FechaHoraReserva { get; set; }
        public DateTime FechaHoraExpiracion { get; set; }
        public string Estado { get; set; }

        public List<AsientoReservaDTO> Asientos { get; set; }
    }
}
