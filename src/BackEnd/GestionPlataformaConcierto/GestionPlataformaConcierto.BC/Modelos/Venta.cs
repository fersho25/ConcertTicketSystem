using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GestionPlataformaConcierto.BC.LogicaDeNegocio.Enum;

namespace GestionPlataformaConcierto.BC.Modelos
{
    public class Venta
    {
        public int Id { get; set; }
        public int ConciertoId { get; set; }
        public DateTime FechaFin { get; set; }
        public EstadoVenta Estado { get; set; }
        public Concierto Concierto { get; set; }
    }
}
