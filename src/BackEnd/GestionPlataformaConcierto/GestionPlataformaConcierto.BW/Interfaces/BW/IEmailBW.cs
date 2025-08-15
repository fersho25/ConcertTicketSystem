

namespace GestionPlataformaConcierto.BW.Interfaces.BW
{
    public interface IEmailBW
    {
        Task<bool> EnviarEmail(string to, string subject, string body);
    }
}
