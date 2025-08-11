namespace GestionPlataformaConcierto.BC.Modelos
{
    public class SaleDetailDto
    {
        public string CategoriaAsiento { get; set; }
        public decimal Precio { get; set; }
        public string Comprador { get; set; }
        public DateTime FechaCompra { get; set; }
    }
}