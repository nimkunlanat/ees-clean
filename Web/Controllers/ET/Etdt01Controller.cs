using Application.Features.ET.ETDT01;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Web.Controllers.ET;

public class Etdt01Controller : BaseController
{
    [AllowAnonymous]
    [HttpGet("list")]
    public async Task<ActionResult> List([FromQuery] List.Query query) => Ok(await Mediator.Send(query));

    [HttpGet("detail")]
    public async Task<ActionResult> Detail([FromQuery] Detail.Query query) => Ok(await Mediator.Send(query));

    [HttpPost("update")]
    public async Task<ActionResult> Post([FromBody] Save.Command command) => Ok(await Mediator.Send(command));
}
