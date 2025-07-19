namespace GestionPlataformaConcierto.BC.Modelos
{
    public class Usuario
    {
        public int Id { get; set; }

        public string NombreCompleto { get; set; }

        public string CorreoElectronico { get; set; }

        public string Contrasena { get; set; }

        public string Rol { get; set; }
        public List<Concierto> ConciertosCreados { get; set; } = new List<Concierto>();
    }
}
