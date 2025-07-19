using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GestionPlataformaConcierto.DA.Entidades
{
    [Table("Usuario")]
    public class UsuarioDA
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string NombreCompleto { get; set; }

        [Required]
        [MaxLength(255)]
        public string CorreoElectronico { get; set; }

        [Required]
        public string Contrasena { get; set; }

        public string Rol { get; set; }

        public ICollection<ConciertoDA> ConciertosCreados { get; set; }
    }
}
