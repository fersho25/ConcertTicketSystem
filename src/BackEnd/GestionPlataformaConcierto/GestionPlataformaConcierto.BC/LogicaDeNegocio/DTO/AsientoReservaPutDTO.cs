namespace GestionPlataformaConcierto.BC.LogicaDeNegocio.DTO
{
    public class AsientoReservaPutDTO
    {
        public int Id { get; set; } 
        public int CategoriaAsientoId { get; set; }
        public int NumeroAsiento { get; set; }
        public decimal Precio { get; set; }
    }
}
