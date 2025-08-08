namespace GestionPlataformaConcierto.BC.Modelos
{
    public class AsientoReserva
    {
        public int Id { get; set; }
        public int CategoriaAsientoId { get; set; }
        public CategoriaAsiento CategoriaAsiento { get; set; }
        public int NumeroAsiento { get; set; }
        public decimal Precio { get; set; }
        public int ReservaId { get; set; }
        public Reserva reserva { get; set; }
    }
}
