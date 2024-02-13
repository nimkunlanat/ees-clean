using Application.Features.ET.ETDT02;
using Domain.Entities.ET;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Web.Controllers.ET
{
    public class Etdt02Controller : BaseController
    {

        [HttpPut("list")]
        public async Task<ActionResult> List([FromBody] List.Query query) => Ok(await Mediator.Send(query));

        [HttpGet("document")]
        public async Task<ActionResult> Document([FromQuery] Document.Query query) => Ok(await Mediator.Send(query));
    }
}
