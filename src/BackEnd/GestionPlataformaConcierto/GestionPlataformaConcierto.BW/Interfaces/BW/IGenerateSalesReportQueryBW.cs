using GestionPlataformaConcierto.BC.LogicaDeNegocio.DTO;

namespace GestionPlataformaConcierto.BW.CU
{
    public interface IGenerateSalesReportQueryBW
    {
        Task<ReportDto> GenerateSalesReportAsync(int concertId, string format, CancellationToken cancellationToken);
    }
}
