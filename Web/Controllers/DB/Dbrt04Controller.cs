using Application.Features.DB.DBRT04;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Web.Controllers.DB
{
    public class Dbrt04Controller : BaseController
    {
        [HttpGet("master")]
        public async Task<ActionResult> Master([FromQuery] Master.Query query) => Ok(await Mediator.Send(query));

        [HttpGet("list")]
        public async Task<ActionResult> List([FromQuery] List.Query query) => Ok(await Mediator.Send(query));

        [HttpGet("listDistrict")]
        public async Task<ActionResult> ListDistrict([FromQuery] ListDistrict.Query query) => Ok(await Mediator.Send(query));

        [HttpGet("ListSubDistrict")]
        public async Task<ActionResult> ListSubDistrict([FromQuery] ListSubDistrict.Query query) => Ok(await Mediator.Send(query));

        [HttpDelete("delete")]
        public async Task<ActionResult> Delete([FromQuery] Delete.Command command) => Ok(await Mediator.Send(command));
        
        [HttpDelete("deleteDistrict")]
        public async Task<ActionResult> DeleteDistrict([FromQuery] DeleteDistrict.Command command) => Ok(await Mediator.Send(command));

        [HttpDelete("deleteSubdistrict")]
        public async Task<ActionResult> DeleteSubdistrict([FromQuery] DeleteSubdistrict.Command command) => Ok(await Mediator.Send(command));

        [HttpGet("detail")]
        public async Task<ActionResult> Detail([FromQuery] Detail.Query query) => Ok(await Mediator.Send(query));

        [HttpGet("detailDistrict")]
        public async Task<ActionResult> DetailDistrict([FromQuery] DetailDistrict.Query query) => Ok(await Mediator.Send(query));

        [HttpGet("detailSubdistrict")]
        public async Task<ActionResult> DetailSubdistrict([FromQuery] DetailSubdistrict.Query query) => Ok(await Mediator.Send(query));

        [HttpPost("update")]
        public async Task<ActionResult> Post([FromBody] Save.Command command) => Ok(await Mediator.Send(command));

        [HttpPost("updateDistrict")]
        public async Task<ActionResult> PostDistrict([FromBody] SaveDistrict.Command command) => Ok(await Mediator.Send(command));

        [HttpPost("updateSubdistrict")]
        public async Task<ActionResult> PostSubdistrict([FromBody] SaveSubdistrict.Command command) => Ok(await Mediator.Send(command));
    }
}
