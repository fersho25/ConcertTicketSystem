using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GestionPlataformaConcierto.DA.Entidades
{
    [Table("ArchivoMultimedia")]
    public class ArchivoMultimediaDA
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string NombreArchivo { get; set; }

        [Required]
        [MaxLength(500)]
        public string Ruta { get; set; }

        [Required]
        [MaxLength(50)]
        public string Tipo { get; set; }

        // Clave foránea a Concierto
        [Required]
        public int ConciertoId { get; set; }

        [ForeignKey("ConciertoId")]
        public ConciertoDA? Concierto { get; set; }
    }
}
