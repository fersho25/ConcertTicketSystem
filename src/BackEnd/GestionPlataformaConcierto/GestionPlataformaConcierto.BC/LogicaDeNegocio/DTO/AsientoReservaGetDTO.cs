namespace GestionPlataformaConcierto.BC.LogicaDeNegocio.DTO
{
    public class AsientoReservaGetDTO
    {
        public int CategoriaAsientoId { get; set; }
        public string CategoriaNombre { get; set; } // Nombre de la categoría
        public int NumeroAsiento { get; set; }
        public decimal Precio { get; set; }
        public string Estado { get; set; } // DISPONIBLE, RESERVADO, COMPRADA
    }
}
