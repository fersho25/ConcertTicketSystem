using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using GestionPlataformaConcierto.BC.Modelos;

namespace GestionPlataformaConcierto.DA.Entidades
{
    [Table("Compra")]
    public class CompraDA
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Reserva")]
        public int ReservaId { get; set; }
        public Reserva Reserva { get; set; }

        public ICollection<AsientoReserva> Asientos { get; set; }

        [Required]
        [MaxLength(20)]
        public string MetodoPago { get; set; }

        public DateTime? FechaHoraCompra { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal PrecioTotal { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal DescuentoAplicado { get; set; }

        [MaxLength(100)]
        public string PromocionAplicada { get; set; }

        [MaxLength(255)]
        public string CodigoQR { get; set; }

        public bool Notificado { get; set; }

        [Required]
        [MaxLength(20)]
        public string Estado { get; set; }
    }
}
