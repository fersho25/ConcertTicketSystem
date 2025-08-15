using Azure.Core;
using GestionPlataformaConcierto.BC.Modelos;
using GestionPlataformaConcierto.BW.Interfaces.BW;
using Microsoft.AspNetCore.Mvc;

namespace GestionPlataformaConcierto.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmailController : ControllerBase
    {
        private readonly IEmailBW emailBW;

        public EmailController(IEmailBW emailBW)
        {
            this.emailBW = emailBW;
        }

        [HttpPost("enviarCorreo")]
        public async Task<IActionResult> EnviarCorreo([FromBody] Email email)
        {
            try
            {
              var emailEnviado =  await emailBW.EnviarEmail(email.To, email.Subject, email.Body);

                if (!emailEnviado)
                {
                    return BadRequest("No se pudo enviar el correo");
                }

                return Ok(true);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al enviar el correo: {ex.Message}");
            }
        }
    }
}
