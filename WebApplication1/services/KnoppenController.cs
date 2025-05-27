namespace WebApplication1.services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

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
        await _hubContext.Clients.All.SendAsync("KnopIngedrukt", status);
        Console.WriteLine("ontvangen");
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