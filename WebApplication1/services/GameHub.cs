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
        public async Task PlayerReachedTop(string gameId, int playerNumber)
        {
            Console.WriteLine($"Speler {playerNumber} heeft de bovenkant bereikt in game {gameId}");
            await Clients.Group(gameId).SendAsync("PlayerWon", playerNumber);
        }

        public async Task NextLevel(string gameId, int playerNumber)
        {
            // Logica om level te starten of speler naar volgend level te sturen
            Console.WriteLine($"Player {playerNumber} in game {gameId} wil naar next level");
            GameState state = _gameManager.Games[gameId];

            await Clients.Client(_gameManager.Connections[state.playerID2]).SendAsync("StartNextLevel", gameId, 2);
            await Clients.Client(_gameManager.Connections[state.playerID1]).SendAsync("StartNextLevel", gameId, 1);

            // Bijvoorbeeld:
            //await Clients.Group(gameId).SendAsync("StartNextLevel", gameId, playerNumber);
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
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            string connectionID = Context.ConnectionId;
            

            await base.OnDisconnectedAsync(exception);
        }

        public Task PingServer()
        {
            // You can simply return a Task.CompletedTask to acknowledge the ping
            Console.WriteLine("Ping received from client.");
            return Task.CompletedTask;
        }

        public async Task JoinGame(int playerNumber, int gameNumber)
        {
            Console.WriteLine("start");
            await _gameManager.JoinGame(Context.ConnectionId, playerNumber, gameNumber);
        }

        public async Task SendMovement(float xPos, float yPos, string gameId)
        {
            GameState currentState = _gameManager.Games[gameId];
            await currentState.SendMovement(xPos, yPos);
        }
        public async Task RespawnWave(string gameId)
        {
            GameState currentState = _gameManager.Games[gameId];
            await currentState.SpawnWaves();
        }

        public async Task ShapePressed(int shapePressed, int gameOrder, string gameId) 
        {
            GameState currentState = _gameManager.Games[gameId];
            await currentState.CheckLights(shapePressed, gameOrder);
        }
    }
}
