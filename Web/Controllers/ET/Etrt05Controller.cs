using Application.Features.ET.ETRT05;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Web.Controllers.ET;

public class Etrt05Controller : BaseController
{
    [HttpGet("list")]
    public async Task<ActionResult> List([FromQuery] List.Query query) => Ok(await Mediator.Send(query));

    [HttpDelete("delete")]
    public async Task<ActionResult> Delete([FromQuery] Delete.Command command) => Ok(await Mediator.Send(command));

    [HttpGet("detail")]
    public async Task<ActionResult> Detail([FromQuery] Detail.Query query) => Ok(await Mediator.Send(query));

    [HttpPost("update")]
    public async Task<ActionResult> Post([FromBody] Save.Command command) => Ok(await Mediator.Send(command));

    [HttpGet("evaluation")]
    public async Task<ActionResult> ListEvaluation([FromQuery] ListEvaluation.Query query) => Ok(await Mediator.Send(query));

    [HttpPost("saveForm")]
    public async Task<ActionResult> SaveForm([FromBody] SaveForm.Command command) => Ok(await Mediator.Send(command));

    //[HttpDelete("deleteForm")]
    //public async Task<ActionResult> DeleteForm([FromQuery] DeleteForm.Command command) => Ok(await Mediator.Send(command));
}

