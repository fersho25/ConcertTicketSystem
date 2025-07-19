using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GestionPlataformaConcierto.DA.Entidades
{
    [Table("CategoriaAsiento")]
    public class CategoriaAsientoDA
    {

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Nombre { get; set; }

        [Required]
        public decimal Precio { get; set; }

        [Required]
        public int Cantidad { get; set; }

        // Clave foránea a Concierto
        [Required]
        public int ConciertoId { get; set; }

        [ForeignKey("ConciertoId")]
        public ConciertoDA? Concierto { get; set; }

    }
}