using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Application.Features.TM.TMDT01;

namespace Web.Controllers.TM
{
    
    public class Tmdt01Controller : BaseController
    {
        [HttpGet("list")]
        public async Task<ActionResult> List([FromQuery] List.Query query) => Ok(await Mediator.Send(query));
    }
}
