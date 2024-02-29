using Application.Features.ET.ETDT01;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Web.Controllers.ET;

public class Etdt01Controller : BaseController
{
    [AllowAnonymous]
    [HttpGet("listAssessment")]
    public async Task<ActionResult> ListAssessment([FromQuery] ListAssessment.Query query) => Ok(await Mediator.Send(query));

    [HttpGet("listSkillmatrix")]
    public async Task<ActionResult> ListSkillmatrix([FromQuery] ListSkillmatrix.Query query) => Ok(await Mediator.Send(query));

    [HttpGet("calculate")]
    public async Task<ActionResult> Calculate([FromQuery] Calculate.Query query) => Ok(await Mediator.Send(query));

    [HttpGet("detail")]
    public async Task<ActionResult> Detail([FromQuery] Detail.Query query) => Ok(await Mediator.Send(query));

    [HttpPost("update")]
    public async Task<ActionResult> Post([FromBody] Save.Command command) => Ok(await Mediator.Send(command));
}
