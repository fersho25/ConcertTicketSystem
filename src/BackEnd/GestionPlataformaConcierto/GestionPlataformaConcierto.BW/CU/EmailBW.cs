using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GestionPlataformaConcierto.BW.Interfaces.BW;
using GestionPlataformaConcierto.BW.Interfaces.DA;

namespace GestionPlataformaConcierto.BW.CU
{
    public class EmailBW : IEmailBW
    {
        private readonly IEmailDA emailDA;
        public EmailBW(IEmailDA emailDA)
        {
            this.emailDA = emailDA;
        }

        Task<bool> IEmailBW.EnviarEmail(string to, string subject, string body)
        {
            return emailDA.EnviarEmail(to, subject, body);
        }
    }
}
