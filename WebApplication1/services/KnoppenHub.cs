using Microsoft.AspNetCore.SignalR;

namespace WebApplication1.services
{
    public class KnoppenHub : Hub
    {
        public async Task KnopIngedrukt(string button)
        {
            // Handle incoming button press data
            Console.WriteLine($"Button pressed: {button}");
        }
    }
}
