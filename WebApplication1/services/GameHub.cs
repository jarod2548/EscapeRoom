using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.ObjectPool;
using System.Collections.Generic;
using System.Runtime.InteropServices;

namespace WebApplication1.services
{
    public class GameHub : Hub
    {
        private readonly GameManager _gameManager;

        public GameHub(GameManager gameManager)
        {
            _gameManager = gameManager;
        }

        public async Task SendWaveSpawn(int xSpawn, string gameId)
        {
            await Clients.Group(gameId).SendAsync("ReceiveWaveSpawn", xSpawn);
        }
        public override async Task OnConnectedAsync() 
        { 
            string connectionID = Context.ConnectionId;
            

            await base.OnConnectedAsync();
        }

        public Task PingServer()
        {
            // You can simply return a Task.CompletedTask to acknowledge the ping
            Console.WriteLine("Ping received from client.");
            return Task.CompletedTask;
        }

        public async Task JoinGame(int number, int gameNumber)
        {
            await _gameManager.JoinGame(Context.ConnectionId, number, gameNumber);
        }

        public async Task SendMovement(float xPos, float yPos, string gameId)
        {
            GameState currentState = _gameManager.Games[gameId];
            await currentState.SendMovement(xPos, yPos);
        }

        public async Task ShapePressed(int shapePressed, int gameOrder, string gameId) 
        {
            GameState currentState = _gameManager.Games[gameId];
            await currentState.CheckLights(shapePressed, gameOrder);
        }
    }
}
