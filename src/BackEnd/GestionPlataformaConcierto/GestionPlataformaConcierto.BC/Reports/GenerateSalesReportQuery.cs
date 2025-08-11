using MediatR;

namespace GestionPlataformaConcierto.BC.Reports
{
    public record GenerateSalesReportQuery(int ConcertId, string Format) : IRequest<ReportDto>;
}
