using Microsoft.AspNetCore.SignalR;

namespace WebApplication1.services
{
    public class KnoppenHub : Hub
    {
        private readonly GameManager _gameManager;
        public KnoppenHub(GameManager gameManager)
        {
            _gameManager = gameManager;
        }
        public async Task KnopIngedrukt(string button)
        {
            // Handle incoming button press data
            Console.WriteLine($"Button pressed: {button}");
            string connection = Context.ConnectionId;

            await _gameManager.NewRaspberryPI(connection);
        }
    }
}
