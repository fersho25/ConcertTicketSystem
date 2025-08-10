namespace GestionPlataformaConcierto.BC.Modelos
{
    public class ArchivoMultimedia
    {
        public int Id { get; set; }

        public byte[] Contenido { get; set; }

        public string NombreArchivo { get; set; }

        public string Tipo { get; set; }

        public int ConciertoId { get; set; }

        public Concierto Concierto { get; set; }
    }
}
