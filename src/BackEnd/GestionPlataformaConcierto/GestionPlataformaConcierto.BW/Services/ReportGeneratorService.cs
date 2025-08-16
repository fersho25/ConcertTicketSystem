using GestionPlataformaConcierto.BC.LogicaDeNegocio.DTO;
using GestionPlataformaConcierto.BC.Modelos;
using GestionPlataformaConcierto.BW.Interfaces.BW;
using OfficeOpenXml; // <-- Añadido para EPPlus
using System.Collections.Generic;
using System.IO; // <-- Añadido para MemoryStream
using System.Threading.Tasks;

namespace GestionPlataformaConcierto.BW.Services
{
    public class ReportGeneratorService : IReportGeneratorService
    {
        public async Task<byte[]> GenerateExcelReportAsync(IEnumerable<SaleDetailDto> salesData)
        {
            // EPPlus requiere que se establezca el contexto de la licencia.
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            // Usamos un MemoryStream para crear el archivo en memoria.
            await using var stream = new MemoryStream();
            using var package = new ExcelPackage(stream);

            // 1. Añadimos una nueva hoja de cálculo al libro.
            var ws = package.Workbook.Worksheets.Add("Reporte de Ventas");

            // 2. Cargamos los datos desde nuestra lista. El 'true' indica que queremos imprimir los encabezados.
            // EPPlus usará los nombres de las propiedades de 'SaleDetailDto' como encabezados.
            ws.Cells["A1"].LoadFromCollection(salesData, true);

            // 3. (Opcional) Damos formato a las columnas para que se vean mejor.
            ws.Cells[ws.Dimension.Address].AutoFitColumns(); // Autoajustar el ancho de las columnas.
            ws.Column(2).Style.Numberformat.Format = "$#,##0.00"; // Formato de moneda para la columna de Precio.
            ws.Column(4).Style.Numberformat.Format = "yyyy-mm-dd hh:mm"; // Formato para la columna de Fecha.

            // 4. Guardamos los cambios en el paquete.
            await package.SaveAsync();

            // 5. Devolvemos el archivo como un arreglo de bytes.
            return stream.ToArray();
        }
    }
}