using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GestionPlataformaConcierto.BC.LogicaDeNegocio.DTO
{
    public class ArchivoMultimediaDTO
    {
        public int Id { get; set; }
        public string Contenido { get; set; }
        public string NombreArchivo { get; set; }
        public string Tipo { get; set; }
        public int ConciertoId { get; set; }
    }
}
