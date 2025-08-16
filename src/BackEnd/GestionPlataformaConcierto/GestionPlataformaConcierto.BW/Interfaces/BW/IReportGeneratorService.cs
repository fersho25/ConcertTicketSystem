using GestionPlataformaConcierto.BC.LogicaDeNegocio.DTO;
using GestionPlataformaConcierto.BC.Modelos; // O donde tengas el SaleDetailDto
using System.Collections.Generic;
using System.Threading.Tasks;

namespace GestionPlataformaConcierto.BW.Interfaces.BW
{
    public interface IReportGeneratorService
    {
        Task<byte[]> GenerateExcelReportAsync(IEnumerable<SaleDetailDto> salesData);
    }
}