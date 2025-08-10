using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GestionPlataformaConcierto.BC.LogicaDeNegocio.DTO
{
    public class UsuarioGetDTO
    {
        public int Id { get; set; }
        public string NombreCompleto { get; set; }
        public string CorreoElectronico { get; set; }
        public string Rol { get; set; }
        public List<ConciertoDTO> ConciertosCreados { get; set; }
    }
}
