using System.Net;
using System.Net.Mail;
using GestionPlataformaConcierto.BC.Modelos;
using GestionPlataformaConcierto.BW.Interfaces.DA;
using Microsoft.Extensions.Options;

namespace GestionPlataformaConcierto.DA.Acciones
{
    public class EmailDA : IEmailDA
    {
        private readonly SmtpSettings smtpServer;

        public EmailDA(IOptions<SmtpSettings> smtpOptions)
        {
            smtpServer = smtpOptions.Value;
        }

        public async Task<bool> EnviarEmail(string to, string subject, string body)
        {
            using (var client = new SmtpClient(smtpServer.Server, smtpServer.Port))
            {
                client.Credentials = new NetworkCredential(smtpServer.Username, smtpServer.Password);
                client.EnableSsl = smtpServer.UseSSL;

                var mail = new MailMessage();
                mail.From = new MailAddress(smtpServer.SenderEmail, smtpServer.SenderName);
                mail.To.Add(to);
                mail.Subject = subject;
                mail.Body = body;
                mail.IsBodyHtml = true;

                await client.SendMailAsync(mail);
                return true;
            }
        }
    }
}
