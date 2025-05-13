using Microsoft.AspNetCore.SignalR;

namespace WebApplication1.services
{
    public class GameManager
    {
        private readonly IHubContext<GameHub> _hubContext;

        private static Dictionary<string, GameState> Games = new();
        private static Dictionary<string, string> Connections = new();
        private static Dictionary<string, GameSession> Sessions = new();

        public GameManager(IHubContext<GameHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public GameState CreateGame(string newID)
        {
            GameState newState = new GameState(_hubContext, newID);
            Games.Add(newID, newState);
            return new GameState(_hubContext,newID);
        }

        public void AddGameSession() 
        { 
            
        }

        public List<string> GetPlayerIDS(string gameID) 
        {
            List<string > ids = new List<string>();
            ids.Add(Sessions[gameID].playerID1);
            ids.Add(Sessions[gameID].playerID2);
            return ids;
        }
    }
}
