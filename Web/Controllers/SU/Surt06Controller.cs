using Application.Features.SU.SURT06;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Web.Controllers.SU
{
    public class Surt06Controller : BaseController
    {
        [HttpGet]

        public async Task<ActionResult> List([FromQuery] List.Query query)
        {
            return Ok(await Mediator.Send(query));
        }
    }
}
