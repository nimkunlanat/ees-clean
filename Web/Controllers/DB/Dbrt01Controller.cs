using Application.Features.DB.DBRT01;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Web.Controllers.DB
{
    public class Dbrt01Controller : BaseController
    {
        [HttpGet("list")]
        public async Task<ActionResult> List([FromQuery] List.Query query) => Ok(await Mediator.Send(query));
    }
}
