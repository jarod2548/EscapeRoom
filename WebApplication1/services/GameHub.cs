using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.ObjectPool;
using System.Collections.Generic;
using System.Runtime.InteropServices;

namespace WebApplication1.services
{
    public class GameHub : Hub
    {
        private static Dictionary<string, GameState> Games = new();
        private static Dictionary<string, string> Players = new();
        private static Dictionary<string, string> Connections = new();

        public override async Task OnConnectedAsync() 
        { 
            string connectionID = Context.ConnectionId;
            

            await base.OnConnectedAsync();
        }

        public async Task CreateGame(string playerID, string player2ID) 
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
            GameState state = new GameState();
            Games.Add(state.ID,state);

            await Clients.Client(Connections[playerID]).SendAsync("StartGame", list, state.ID, playerID, 1);
            await Clients.Client(Connections[player2ID]).SendAsync("StartGame", list, state.ID, player2ID, 2);
        }

        public async Task JoinGame(int number)
        {
            string connectionID = Context.ConnectionId;

            string player1ID = Guid.NewGuid().ToString();

            Connections.Add(player1ID, connectionID);
            string player2ID = null;

            foreach( KeyValuePair<string,string> player in Players ) 
            { 
                if(player.Value == "waiting") 
                {
                    player2ID = player.Key;
                    Players[player.Key] = player1ID;
                    Players[player.Value] = player2ID;
                    break;
                }
            }

            if(player2ID == null) 
            {
                Players[player1ID] = "waiting";
            }
            else 
            {
                try
                {
                    //await Groups.AddToGroupAsync(Context.ConnectionId, gameId);
                    await CreateGame(player1ID, player2ID);
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex);
                }
            }      
        }

        public async Task ShapePressed(int shapePressed, string gameId) 
        {
            GameState currentState = Games[gameId];
            await currentState.CheckLights(shapePressed);
        }

        public async Task MakeMove(string gameId, int move) 
        { 
            var game = Games[gameId];

            await Clients.Group(gameId).SendAsync("UpdateGame", game);
        }
    }
}
