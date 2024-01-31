using Application.Features.DB.DBRT03;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Web.Controllers.DB;

public class Dbrt03Controller : BaseController
{
    [AllowAnonymous]
    [HttpGet("list")]
    public async Task<ActionResult> List([FromQuery] List.Query query) => Ok(await Mediator.Send(query));

    [HttpGet("detail")]
    public async Task<ActionResult> Detail([FromQuery] Detail.Query query) => Ok(await Mediator.Send(query));

    [HttpPost("update")]
    public async Task<ActionResult> Post([FromBody] Save.Command command) => Ok(await Mediator.Send(command));

    [HttpDelete("delete")]
    public async Task<ActionResult> Delete([FromQuery] Delete.Command command) => Ok(await Mediator.Send(command));
}
