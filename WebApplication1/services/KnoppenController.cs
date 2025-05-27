namespace WebApplication1.services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Text.Json;
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
    [HttpPost]
    public IActionResult OnPost([FromBody] KnopStatus data)
    {
        // Logging voor debug
        Console.WriteLine($"Ontvangen van Raspberry Pi: {JsonSerializer.Serialize(data)}");

        // Hier kun je extra logica toevoegen, zoals acties uitvoeren op basis van knoppen

        return new JsonResult(new { status = "OK", ontvangen = data });
    }
}

public class KnopStatus
{
    public bool Button1 { get; set; }
    public bool Button2 { get; set; }
    public bool Button3 { get; set; }
    public bool Button4 { get; set; }
}