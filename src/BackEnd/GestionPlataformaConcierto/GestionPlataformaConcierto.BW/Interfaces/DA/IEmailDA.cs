
namespace GestionPlataformaConcierto.BW.Interfaces.DA
{
    public interface IEmailDA
    {
        Task<bool> EnviarEmail(string to, string subject, string body);
    }
}
