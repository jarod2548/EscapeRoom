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

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            string connectionID = Context.ConnectionId;
            await _gameManager.OnDisconnectedRasp(connectionID);

            await base.OnDisconnectedAsync(exception);
        }

        public async Task StartConnection(string playerID)
        {
            string connection = Context.ConnectionId;
            await _gameManager.NewRaspberryPI(connection, playerID);
        }
        public async Task KnopIngedrukt(string button)
        {
            // Handle incoming button press data
            Console.WriteLine($"Button pressed: {button}");
            string connection = Context.ConnectionId;
            Console.WriteLine(connection);

            await _gameManager.MovementFromRaspBerryPi(button);
        }

        public async Task CorrectLamp()
        {
            Console.WriteLine("ReceivedCorrectLamp");
            await _gameManager.RaspLevel3Complete();
        }
    }
}
