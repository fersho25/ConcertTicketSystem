namespace GestionPlataformaConcierto.BC.LogicaDeNegocio.DTO
{
    public class CategoriaAsientoDTO
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public decimal Precio { get; set; }
        public int Cantidad { get; set; }
        public int ConciertoId { get; set; }
    }
}
