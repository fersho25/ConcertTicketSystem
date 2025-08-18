using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GestionPlataformaConcierto.BC.LogicaDeNegocio.DTO
{
    public class PromocionDTO
    {
        public int Id { get; set; }

        public string Nombre { get; set; }

        public int Descuento { get; set; } 

        public bool Activa { get; set; }

        public string FechaFin { get; set; }

        public int ConciertoId { get; set; } 
    }
}
