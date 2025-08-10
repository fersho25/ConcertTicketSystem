using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using GestionPlataformaConcierto.BC.Modelos;

namespace GestionPlataformaConcierto.DA.Entidades
{
    [Table("Reserva")]
    public class ReservaDA
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Usuario")]
        public int UsuarioId { get; set; }
        public Usuario Usuario { get; set; }

        [Required]
        [ForeignKey("Concierto")]
        public int ConciertoId { get; set; }
        public Concierto Concierto { get; set; }

        [Required]
        public DateTime FechaHoraReserva { get; set; }

        [Required]
        public DateTime FechaHoraExpiracion { get; set; }

        [Required]
        [MaxLength(20)]
        public string Estado { get; set; }

        [Required]
        [MaxLength(50)]
        public string MetodoPago { get; set; }

        public DateTime? FechaHoraCompra { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal PrecioTotal { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal DescuentoAplicado { get; set; }

        [MaxLength(100)]
        public string PromocionAplicada { get; set; }

        [MaxLength(255)]
        public string CodigoQR { get; set; }

        [Required]
        public bool Notificado { get; set; }

        public ICollection<AsientoReserva> Asientos { get; set; }
    }
}
