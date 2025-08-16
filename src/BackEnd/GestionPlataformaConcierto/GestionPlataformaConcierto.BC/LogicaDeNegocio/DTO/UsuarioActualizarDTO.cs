
namespace GestionPlataformaConcierto.BC.LogicaDeNegocio.DTO
{
    public class UsuarioActualizarDTO
    {
        public int id { get; set; }
        public string NombreCompleto { get; set; }
        public string CorreoElectronico { get; set; }
        public string ContrasenaActual { get; set; } 
        public string ContrasenaNueva { get; set; }  
    }

}
