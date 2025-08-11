


using GestionPlataformaConcierto.BC.LogicaDeNegocio.DTO;
using GestionPlataformaConcierto.BC.ReglasDeNegocio;
using GestionPlataformaConcierto.BW.Interfaces.DA;

namespace GestionPlataformaConcierto.BW.CU
{
    public class GenerateSalesReportQueryBW
    {
        private readonly IGestionarConciertoDA gestionarConciertoDA;
        
        public GenerateSalesReportQueryBW(IGestionarConciertoDA gestionarConciertoDA)
        {
            this.gestionarConciertoDA = gestionarConciertoDA;
        }

        public async Task<ReportDto> GenerateSalesReportAsync(int concertId)
        {
            if (!ReglasDeConcierto.elIdEsValido(concertId))
            {
                return await Task.FromResult<ReportDto>(null);
            }

            var salesData = await gestionarConciertoDA.GetSalesDetailsByConcertAsync(concertId);

            if (salesData == null || !salesData.Any())
            {
                return await Task.FromResult<ReportDto>(null);
            }

            return new ReportDto
            {
                //FileName = concertId,
                //SalesDetails = salesData.ToList(),
                //Format = format
            };
        }

    }
}
