using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using GestionPlataformaConcierto.BC.Modelos;

namespace GestionPlataformaConcierto.DA.Entidades
{
    [Table("Concierto")]
    public class ConciertoDA
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public string Nombre { get; set; }

        [Required]
        public string Descripcion { get; set; }

        [Required]
        public DateTime Fecha { get; set; }

        [Required]
        public string Lugar { get; set; }

        [Required]
        public int Capacidad { get; set; }

        [Required]
        public int UsuarioID { get; set; }

        public ICollection<CategoriaAsiento> CategoriasAsiento { get; set; }

        public ICollection<ArchivoMultimedia> ArchivosMultimedia { get; set; }

    }
}