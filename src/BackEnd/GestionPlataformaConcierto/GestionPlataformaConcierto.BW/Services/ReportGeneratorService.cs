using GestionPlataformaConcierto.BC.LogicaDeNegocio.DTO;
using GestionPlataformaConcierto.BC.Modelos;
using GestionPlataformaConcierto.BW.Interfaces.BW;
using OfficeOpenXml;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace GestionPlataformaConcierto.BW.Services
{
    public class ReportGeneratorService : IReportGeneratorService
    {
        public async Task<byte[]> GenerateExcelReportAsync(IEnumerable<SaleDetailDto> salesData)
        {
            await using var stream = new MemoryStream();
            using var package = new ExcelPackage(stream);

            var ws = package.Workbook.Worksheets.Add("Reporte de Ventas");

            ws.Cells["A1"].LoadFromCollection(salesData, true);

            ws.Cells.AutoFitColumns();
            ws.Column(2).Style.Numberformat.Format = "$#,##0.00";
            ws.Column(4).Style.Numberformat.Format = "yyyy-mm-dd hh:mm";

            await package.SaveAsync();

            return stream.ToArray();
        }
    }
}

