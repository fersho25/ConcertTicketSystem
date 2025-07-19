namespace GestionPlataformaConcierto.BC.Modelos
{
    public class Concierto
    {
        public int Id { get; set; }

        public string Nombre { get; set; }

        public string Descripcion { get; set; }

        public DateTime Fecha { get; set; }

        public string Lugar { get; set; }

        public int Capacidad { get; set; }

        public List<CategoriaAsiento> CategoriasAsiento { get; set; }

        public List<ArchivoMultimedia> ArchivosMultimedia { get; set; }

        public int UsuarioID { get; set; }

        public Usuario Usuario { get; set; }
    }

}
