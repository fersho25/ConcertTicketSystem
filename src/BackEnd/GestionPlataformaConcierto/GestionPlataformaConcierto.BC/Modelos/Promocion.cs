
namespace GestionPlataformaConcierto.BC.Modelos
{
    public class Promocion
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public int Descuento { get; set; } 
        public bool Activa { get; set; }

        public DateTime FechaFin { get; set; }

        public int ConciertoId { get; set; }
        public Concierto Concierto { get; set; }
    }
}
