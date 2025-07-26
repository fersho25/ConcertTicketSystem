using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GestionPlataformaConcierto.BW.DTO
{
    public class UsuarioRespuestaDTO
    {
        public int Id { get; set; }
        public string NombreCompleto { get; set; }
        public string CorreoElectronico { get; set; }
        public string Rol { get; set; }
    }
}
