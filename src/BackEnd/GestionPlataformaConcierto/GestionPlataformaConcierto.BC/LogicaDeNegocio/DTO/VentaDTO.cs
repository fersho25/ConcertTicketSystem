using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GestionPlataformaConcierto.BC.LogicaDeNegocio.Enum;

namespace GestionPlataformaConcierto.BC.LogicaDeNegocio.DTO
{
    public class VentaDTO
    {
        public int Id { get; set; }
        public int ConciertoId { get; set; }
        public string FechaFin { get; set; }
        public EstadoVenta Estado { get; set; }
    }
}
