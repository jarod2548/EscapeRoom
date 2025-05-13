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

        private static Dictionary<string, GameState> Games = new();
        private static Dictionary<string, string> Connections = new();
        private static Dictionary<string, GameSession> Sessions = new();

        public override async Task OnConnectedAsync() 
        { 
            string connectionID = Context.ConnectionId;
            

            await base.OnConnectedAsync();
        }

        public async Task CreateGame(string playerID, string player2ID, string gameID) 
        {
            Random rnd = new Random();
            
            
            List<List<int>> list = new List<List<int>>();
            for( int i = 0; i < 4; i++ ) 
            {
                HashSet<int> colorInts = new HashSet<int>();
                while (colorInts.Count < 4)
                {
                    int num = rnd.Next(1, 5);
                    colorInts.Add(num);
                }
                list.Add(colorInts.ToList());
            }
            GameState state = _gameManager.CreateGame(gameID);
            Games.Add(state.ID, state);

            await Clients.Client(Connections[playerID]).SendAsync("StartGame", list, state.buttonToUse, state.ID, playerID, 1);
            await Clients.Client(Connections[player2ID]).SendAsync("StartGame", list, state.buttonToUse, state.ID, player2ID, 2);
        }

        public async Task JoinGame(int number)
        {
            string connectionID = Context.ConnectionId;

            string player1ID = Guid.NewGuid().ToString();

            Connections.Add(player1ID, connectionID);
            string player2ID = null;
            string gameID = null;

            foreach (KeyValuePair<string, GameSession> Session in Sessions) 
            { 
                if(Session.Value.playerID2 == "waiting") 
                {
                    gameID = Session.Key;
                    player2ID = Session.Value.playerID1;
                    Session.Value.playerID2 = player2ID;
                    Sessions[gameID].playerID1 = player1ID;
                    Sessions[gameID].playerID2 = player2ID;
                    break;
                }
            }

            if(player2ID == null) 
            {
                gameID = Guid.NewGuid().ToString();
                GameSession session = new GameSession 
                { 
                    playerID1 = player1ID,
                    playerID2 = "waiting"
                };
                Sessions.Add(gameID, session);
                Console.WriteLine(Sessions);
            }
            else 
            {
                try
                {
                    //await Groups.AddToGroupAsync(Context.ConnectionId, gameId);
                    await CreateGame(player1ID, player2ID, gameID);
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex);
                }
            }      
        }

        public async Task ShapePressed(int shapePressed, int gameOrder, string gameId) 
        {
            GameState currentState = Games[gameId];
            await currentState.CheckLights(shapePressed, gameOrder);
        }


        public async Task sendResponse(string gameID) 
        {
            string playerID1 = Sessions[gameID].playerID1;
            string playerID2 = Sessions[gameID].playerID2;
            await Clients.Client(Connections[playerID1]).SendAsync("Response");
            await Clients.Client(Connections[playerID2]).SendAsync("Response");
        }
        public async Task MakeMove(string gameId, int move) 
        { 
            var game = Games[gameId];

            await Clients.Group(gameId).SendAsync("UpdateGame", game);
        }
    }
}
