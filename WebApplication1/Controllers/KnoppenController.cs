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
    private readonly GameManager _gameManager;

    public KnoppenController(IHubContext<KnoppenHub> hubContext, GameManager gameManager)
    {
        _hubContext = hubContext;
        _gameManager = gameManager;
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] KnopStatus status)
    {
        if (status.Button1) {
            _gameManager.MovementFromRaspBerryPi(Directions.left);
            Console.WriteLine("Button 1 is pressed");
        } 
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
public enum Directions { left, right, up , down}