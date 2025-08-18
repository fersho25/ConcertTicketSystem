using GestionPlataformaConcierto.BW.CU;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Linq; // <-- Añade este using
using System.Threading.Tasks;

namespace GestionPlataformaConcierto.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ReportsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("sales-file/{concertId}")]
        public async Task<IActionResult> GetSalesReportFile(int concertId, [FromQuery] string format = "excel")
        {
            var query = new GenerateSalesReportQuery(concertId, format);
            var reportDto = await _mediator.Send(query);

            if (reportDto != null && reportDto.Content.Length > 0)
            {
                return File(reportDto.Content, reportDto.ContentType, reportDto.FileName);
            }

            return NotFound("No se pudo generar el reporte o no hay datos disponibles.");
        }

        [HttpGet("sales-chart-data/{concertId}")]
        public async Task<IActionResult> GetSalesChartData(int concertId)
        {
            var query = new GenerateSalesReportQuery(concertId, "excel");
            var reportDto = await _mediator.Send(query);

            if (reportDto != null && reportDto.RawData.Any())
            {
                return Ok(reportDto.RawData);
            }

            return NotFound("No se encontraron datos de ventas para este concierto.");
        }
    }
}