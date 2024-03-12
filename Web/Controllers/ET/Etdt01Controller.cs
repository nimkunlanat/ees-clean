using Application.Features.ET.ETDT01;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Web.Controllers.ET;

public class Etdt01Controller : BaseController
{
    [HttpGet("master")]
    public async Task<ActionResult> Master([FromQuery] Master.Query query) => Ok(await Mediator.Send(query));

    [HttpGet("list")]
    public async Task<ActionResult> List([FromQuery] List.Query query) => Ok(await Mediator.Send(query));

    [HttpGet("listAssessment")]
    public async Task<ActionResult> ListAssessment([FromQuery] ListAssessment.Query query) => Ok(await Mediator.Send(query));

    [HttpGet("listSkillmatrix")]
    public async Task<ActionResult> ListSkillmatrix([FromQuery] ListSkillmatrix.Query query) => Ok(await Mediator.Send(query));

    [HttpGet("calculate")]
    public async Task<ActionResult> Calculate([FromQuery] Calculate.Query query) => Ok(await Mediator.Send(query));

    [HttpPost("update")]
    public async Task<ActionResult> Post([FromBody] Save.Command command) => Ok(await Mediator.Send(command));

    [HttpDelete("delete")]
    public async Task<ActionResult> Delete([FromQuery] Delete.Command command) => Ok(await Mediator.Send(command));
}
