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

        public override async Task OnConnectedAsync() 
        { 
            string connectionID = Context.ConnectionId;
            

            await base.OnConnectedAsync();
        }

        public async Task JoinGame(int number, int gameNumber)
        {
            await _gameManager.JoinGame(Context.ConnectionId, number, gameNumber);
        }

        public async Task Movement()
        {

        }

        public async Task ShapePressed(int shapePressed, int gameOrder, string gameId) 
        {
            GameState currentState = _gameManager.Games[gameId];
            await currentState.CheckLights(shapePressed, gameOrder);
        }
    }
}
