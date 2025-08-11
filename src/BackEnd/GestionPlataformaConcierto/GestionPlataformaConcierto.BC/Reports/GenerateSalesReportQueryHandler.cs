
using GestionPlataformaConcierto.BC.Interfaces.DA; 
using GestionPlataformaConcierto.BC.Modelos;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace GestionPlataformaConcierto.BC.Reports
{
    public class GenerateSalesReportQueryHandler : IRequestHandler<GenerateSalesReportQuery, ReportDto>
    {
        private readonly IGestionarConciertoDA _gestionarConciertoDA;

        public GenerateSalesReportQueryHandler(IGestionarConciertoDA gestionarConciertoDA)
        {
            _gestionarConciertoDA = gestionarConciertoDA;
        }

        public async Task<ReportDto> Handle(GenerateSalesReportQuery request, CancellationToken cancellationToken)
        {
            IEnumerable<SaleDetailDto> salesData = await _gestionarConciertoDA.GetSalesDetailsByConcertAsync(request.ConcertId);

            return new ReportDto();
        }
    }
}