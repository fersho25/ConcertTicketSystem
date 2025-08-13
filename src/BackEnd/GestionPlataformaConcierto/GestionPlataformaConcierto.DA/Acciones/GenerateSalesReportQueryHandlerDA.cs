

using GestionPlataformaConcierto.BC.LogicaDeNegocio.DTO;
using GestionPlataformaConcierto.BC.Reports;
using GestionPlataformaConcierto.BW.CU;
using GestionPlataformaConcierto.BW.Interfaces.DA;
using GestionPlataformaConcierto.DA.Config;
using Microsoft.EntityFrameworkCore;

namespace GestionPlataformaConcierto.BC.Reports
{
    public class GenerateSalesReportQueryHandlerDA : IGenerateSalesReportQueryBW
    {
        private readonly GestionDePlataformaContext gestionDePlataformaContext;

        public GenerateSalesReportQueryHandlerDA(GestionDePlataformaContext gestionDePlataformaContext)
        {
            this.gestionDePlataformaContext = gestionDePlataformaContext;
        }

        public async Task<ReportDto> GenerateSalesReportAsync(int concertId, string format, CancellationToken cancellationToken)
        {
            var salesData = await gestionDePlataformaContext.Reserva
         .Where(r => r.ConciertoId == concertId && DateTime.MinValue != null && r.Estado == "Comprado")
         .Select(r => new SaleDetailDto
         {
             //ReservaId = r.Id,
             //UsuarioId = r.UsuarioId,
             //PrecioTotal = r.PrecioTotal,
             //DescuentoAplicado = r.DescuentoAplicado,
             //MetodoPago = r.MetodoPago,
             //PromocionAplicada = r.PromocionAplicada,
             //FechaCompra = r.FechaHoraCompra.Value
         })
         .ToListAsync(cancellationToken);

            return new ReportDto
            {
                //ConcertId = concertId,
                //SalesDetails = salesData,
                //Format = format
            };


        }
    }
}
