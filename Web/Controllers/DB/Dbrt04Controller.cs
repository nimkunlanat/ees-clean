using Application.Features.DB.DBRT04;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Web.Controllers.DB
{
    public class Dbrt04Controller : BaseController
    {
        [HttpGet("list")]
        public async Task<ActionResult> List([FromQuery] List.Query query) => Ok(await Mediator.Send(query));

        [HttpDelete("delete")]
        public async Task<ActionResult> Delete([FromQuery] Delete.Command command) => Ok(await Mediator.Send(command));

        [HttpGet("detail")]
        public async Task<ActionResult> Detail([FromQuery] Detail.Query query) => Ok(await Mediator.Send(query));

        [HttpPost("update")]
        public async Task<ActionResult> Post([FromBody] Save.Command command) => Ok(await Mediator.Send(command));
    }
}
