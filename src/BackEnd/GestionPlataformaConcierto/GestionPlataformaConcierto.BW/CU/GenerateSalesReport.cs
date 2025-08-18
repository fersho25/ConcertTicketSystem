
namespace GestionPlataformaConcierto.BW.CU;

using GestionPlataformaConcierto.BC.LogicaDeNegocio.DTO;
using GestionPlataformaConcierto.BW.Interfaces.BW;
using GestionPlataformaConcierto.BW.Interfaces.DA;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

public record GenerateSalesReportQuery(int ConcertId, string Format) : IRequest<ReportDto>;

public class GenerateSalesReportQueryHandler : IRequestHandler<GenerateSalesReportQuery, ReportDto>
{
    private readonly IGestionarConciertoDA _gestionarConciertoDA;
    private readonly IReportGeneratorService _reportGeneratorService;

    public GenerateSalesReportQueryHandler(IGestionarConciertoDA gestionarConciertoDA, IReportGeneratorService reportGeneratorService)
    {
        _gestionarConciertoDA = gestionarConciertoDA;
        _reportGeneratorService = reportGeneratorService;
    }

    public async Task<ReportDto> Handle(GenerateSalesReportQuery request, CancellationToken cancellationToken)
    {
        IEnumerable<SaleDetailDto> salesData = await _gestionarConciertoDA.ObtenerDetallesVentaPorConciertoAsync(request.ConcertId);

        byte[] reportFile;

        if (request.Format.ToLower() == "excel")
        {
            reportFile = await _reportGeneratorService.GenerateExcelReportAsync(salesData);
        }
        else
        {
            reportFile = [];
        }

        return new ReportDto
        {
            Content = reportFile,
            FileName = $"Reporte_Ventas_{request.ConcertId}.xlsx",
            ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            RawData = salesData
        };
    }
}