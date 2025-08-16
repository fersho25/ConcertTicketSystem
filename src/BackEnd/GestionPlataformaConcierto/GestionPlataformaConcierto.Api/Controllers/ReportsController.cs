using GestionPlataformaConcierto.BW.CU; // Para poder usar el Query
using MediatR;
using Microsoft.AspNetCore.Mvc;
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

        [HttpGet("sales/{concertId}")]
        public async Task<IActionResult> GetSalesReport(int concertId, [FromQuery] string format = "excel")
        {
            // 1. Creamos el objeto de la solicitud con los parámetros recibidos.
            var query = new GenerateSalesReportQuery(concertId, format);

            // 2. Enviamos la solicitud al Handler correspondiente usando MediatR.
            var reportDto = await _mediator.Send(query);

            // 3. Si el contenido del reporte es válido, lo devolvemos como un archivo.
            if (reportDto != null && reportDto.Content.Length > 0)
            {
                return File(reportDto.Content, reportDto.ContentType, reportDto.FileName);
            }

            // 4. Si no, devolvemos un error o una respuesta vacía.
            return NotFound("No se pudo generar el reporte o no hay datos disponibles.");
        }
    }
}