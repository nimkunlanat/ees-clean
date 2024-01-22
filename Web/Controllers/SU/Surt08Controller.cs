using Application.Features.SU.SURT08;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Web.Controllers.SU;

public class Surt08Controller : BaseController
{
    [HttpGet("list")]
    public async Task<ActionResult> List([FromQuery] List.Query query) => Ok(await Mediator.Send(query));
}
