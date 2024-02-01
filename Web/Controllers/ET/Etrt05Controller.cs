using Application.Features.ET.ETRT05;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Web.Controllers.ET;

public class Etrt05Controller : BaseController
{
    //[HttpGet("list")]
    //public async Task<ActionResult> List([FromQuery] List.Query query) => Ok(await Mediator.Send(query));
}
