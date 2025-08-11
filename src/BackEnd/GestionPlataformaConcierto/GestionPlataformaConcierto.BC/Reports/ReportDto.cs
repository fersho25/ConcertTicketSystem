
namespace GestionPlataformaConcierto.BC.Reports
{
    public class ReportDto
    {
        public string FileName { get; set; } = string.Empty;
        public string ContentType { get; set; } = string.Empty;
        public byte[] Content { get; set; } = [];
    }
}
