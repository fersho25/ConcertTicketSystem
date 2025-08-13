using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using GestionPlataformaConcierto.BC.Modelos;

namespace GestionPlataformaConcierto.DA.Entidades
{
    [Table("AsientoReserva")]
    public class AsientoReservaDA
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [ForeignKey("Compra")]
        public int? CompraId { get; set; }   
        public Compra Compra { get; set; }

        [Required]
        [ForeignKey("Reserva")]
        public int ReservaId { get; set; }
        public Reserva Reserva { get; set; }

        [Required]
        [ForeignKey("CategoriaAsiento")]
        public int CategoriaAsientoId { get; set; }
        public CategoriaAsiento CategoriaAsiento { get; set; }

        [Required]
        public int NumeroAsiento { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Precio { get; set; }
    }
}
