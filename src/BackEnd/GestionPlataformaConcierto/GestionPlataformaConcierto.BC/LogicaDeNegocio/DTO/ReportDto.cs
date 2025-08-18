using System.Collections.Generic; 

namespace GestionPlataformaConcierto.BC.LogicaDeNegocio.DTO
{
    public class ReportDto
    {
        public string FileName { get; set; } = string.Empty;
        public string ContentType { get; set; } = string.Empty;
        public byte[] Content { get; set; } = [];
        public IEnumerable<SaleDetailDto> RawData { get; set; } = new List<SaleDetailDto>();
    }
}