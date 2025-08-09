using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GestionPlataformaConcierto.BC.LogicaDeNegocio.DTO
{
    public class ConciertoDTO
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public DateTime Fecha { get; set; }
        public string Lugar { get; set; }
        public int Capacidad { get; set; }
        public int UsuarioID { get; set; }

        public List<CategoriaAsientoDTO> CategoriasAsiento { get; set; }
        public List<ArchivoMultimediaDTO> ArchivosMultimedia { get; set; }
    }
}
