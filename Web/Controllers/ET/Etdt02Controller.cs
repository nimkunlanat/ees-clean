using Application.Features.ET.ETDT02;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Web.Controllers.ET
{
    public class Etdt02Controller : BaseController
    {

        [HttpGet("list")]
        public async Task<ActionResult> List([FromQuery] List.Query query) => Ok(await Mediator.Send(query));
    }
}
