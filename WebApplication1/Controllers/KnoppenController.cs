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
        if (status.Button1) Console.WriteLine("Button 1 is pressed");
        if (status.Button2) Console.WriteLine("Button 2 is pressed");
        if (status.Button3) Console.WriteLine("Button 3 is pressed");
        if (status.Button4) Console.WriteLine("Button 4 is pressed");
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