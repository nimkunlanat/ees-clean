using Application.Features.ET.ETRT06;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Web.Controllers.ET;

public class Etrt06Controller : BaseController
{
    [HttpGet("list")]
    public async Task<ActionResult> List([FromQuery] List.Query query) => Ok(await Mediator.Send(query));

    [HttpDelete("delete")]
    public async Task<ActionResult> Delete([FromQuery] Delete.Command command) => Ok(await Mediator.Send(command));

    [HttpGet("detail")]
    public async Task<ActionResult> Detail([FromQuery] Detail.Query query) => Ok(await Mediator.Send(query));

    [HttpPost("saveForm")]
    public async Task<ActionResult> SaveForm([FromBody] SaveForm.Command command) => Ok(await Mediator.Send(command));

    [HttpGet("grade")]
    public async Task<ActionResult> Grade([FromQuery] Grade.Query query) => Ok(await Mediator.Send(query));

    [HttpPost("saveGrade")]
    public async Task<ActionResult> Post([FromBody] SaveGrade.Command command) => Ok(await Mediator.Send(command));
}
