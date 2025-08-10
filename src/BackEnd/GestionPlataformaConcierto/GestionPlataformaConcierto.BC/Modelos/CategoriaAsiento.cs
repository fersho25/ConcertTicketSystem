using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GestionPlataformaConcierto.BC.Modelos
{
    public class CategoriaAsiento
    {
        public int Id { get; set; }

        public string Nombre { get; set; }

        public int CantidadAsientos { get; set; }

        public decimal Precio { get; set; }

        public int ConciertoId { get; set; }

        public Concierto Concierto { get; set; }
    }
}
