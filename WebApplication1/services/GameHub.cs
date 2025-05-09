using Microsoft.AspNetCore.SignalR;
using System.Collections.Generic;
using System.Runtime.InteropServices;

namespace WebApplication1.services
{
    public class GameHub : Hub
    {
        private static Dictionary<string, GameState> Games = new();

        public override async Task OnConnectedAsync() 
        { 
            string connectionID = Context.ConnectionId;

            Console.WriteLine($"Player connected : {connectionID}");

            await base.OnConnectedAsync();
        }

        public async Task CreateGame() 
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
            

            await Clients.Caller.SendAsync("StartGame", list);
        }

        public async Task JoinGame(string gameId)
        {
            try 
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, gameId);
                await CreateGame();
            }
            catch (Exception ex) 
            {
                Console.WriteLine(ex);
            }
            
        }

        public async Task PressedShape(int shapePressed) 
        { 
            
        }

        public async Task MakeMove(string gameId, int move) 
        { 
            var game = Games[gameId];

            game.CheckLights(move);

            await Clients.Group(gameId).SendAsync("UpdateGame", game);
        }
    }
}
