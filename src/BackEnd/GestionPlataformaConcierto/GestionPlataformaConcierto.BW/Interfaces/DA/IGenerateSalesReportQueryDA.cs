using GestionPlataformaConcierto.BC.LogicaDeNegocio.DTO;

namespace GestionPlataformaConcierto.BW.Interfaces.DA
{
    public interface IGenerateSalesReportQueryDA
    {
        Task<ReportDto> GenerateSalesReportAsync(int concertId, string format, CancellationToken cancellationToken);
    }
}
