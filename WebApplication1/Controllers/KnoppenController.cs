namespace WebApplication1.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Text.Json;
using System.Threading.Tasks;
using WebApplication1.services;

[ApiController]
[Route("api/knoppen")]
public class KnoppenController : ControllerBase
{
    private readonly IHubContext<KnoppenHub> _hubContext;

    public KnoppenController(IHubContext<KnoppenHub> hubContext)
    {
        _hubContext = hubContext;
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] KnopStatus status)
    {
        Console.WriteLine(status);
        Console.WriteLine(status.Button1);
        return Ok();
    }

}

public class KnopStatus
{
    public bool Button1 { get; set; }
    public bool Button2 { get; set; }
    public bool Button3 { get; set; }
    public bool Button4 { get; set; }
}