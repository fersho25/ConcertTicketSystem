

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GestionPlataformaConcierto.DA.Entidades
{
    [Table("Promocion")]
    public class PromocionDA
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Nombre { get; set; }

        [Required]
        public int Descuento { get; set; }


        [Required]
        public DateTime FechaFin { get; set; }

        [Required]
        public bool Activa { get; set; }

        // Clave foránea a Concierto
        [Required]
        public int ConciertoId { get; set; }

        [ForeignKey("ConciertoId")]
        public ConciertoDA? Concierto { get; set; }
    }
}
