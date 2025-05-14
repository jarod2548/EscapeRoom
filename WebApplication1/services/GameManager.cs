using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using System.Xml.XPath;

namespace WebApplication1.services
{
    public class GameManager
    {
        private readonly IHubContext<GameHub> _hubContext;

        public ConcurrentDictionary<string, GameState> Games = new();
        public ConcurrentDictionary<string, string> Connections = new();
        public ConcurrentDictionary<string, GameSession> Sessions = new();

        private readonly object _connectionsLock = new object();
        private readonly object _sessionsLock = new object();

        public GameManager(IHubContext<GameHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task CreateGame(string player1ID, string player2ID,string gameID, int gameNumber)
        {
            GameState newState = new GameState(_hubContext, this, gameID, gameNumber);
            Games.TryAdd(gameID, newState);

            if(gameNumber == 1)
            {
                await _hubContext.Clients.Client(Connections[player1ID]).SendAsync("StartGame", gameID, gameNumber);
            }
            else
            {
                await _hubContext.Clients.Client(Connections[player1ID]).SendAsync("StartGame", newState.colors, newState.buttonToUse, newState.ID, player1ID, 1);
                await _hubContext.Clients.Client(Connections[player2ID]).SendAsync("StartGame", newState.colors, newState.buttonToUse, newState.ID, player2ID, 2);
            }

                

        }

        public async Task JoinGame(string connectionID, int playerNumber, int gameNumber)
        {

            string player1ID = Guid.NewGuid().ToString();
            Connections.TryAdd(player1ID, connectionID);          
            string player2ID = null;
            string gameID = null;

            player2ID = CheckGameSessions(out gameID, player1ID, player2ID);

            if (player2ID == null)
            {
                gameID = Guid.NewGuid().ToString();
                GameSession session = new GameSession
                {
                    playerID1 = player1ID,
                    playerID2 = "waiting"
                };
                Sessions.TryAdd(gameID, session);
            }
            else if (player2ID !=  null) 
            {
                try
                {
                    await CreateGame(player1ID, player2ID, gameID, gameNumber);
                        
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex);
                }
            }
        }

        public async Task SendResponse(string gameID) 
        {
            string playerID1 = Sessions[gameID].playerID1;
            string playerID2 = Sessions[gameID].playerID2;
            GameState currentState = Games[gameID];
            await _hubContext.Clients.Client(Connections[playerID1]).SendAsync("Response", currentState.currentButton);
            await _hubContext.Clients.Client(Connections[playerID2]).SendAsync("Response", currentState.currentButton);
        }

        public async Task SendResponseMovement(string gameID, float xPos, float yPos)
        {
            string playerID1 = Sessions[gameID].playerID1;
            string playerID2 = Sessions[gameID].playerID2;
            GameState currentState = Games[gameID];
            await _hubContext.Clients.Client(Connections[playerID1]).SendAsync("ResponseMovement", xPos, yPos);
            await _hubContext.Clients.Client(Connections[playerID2]).SendAsync("ResponseMovement", xPos, yPos);
        }

        public string CheckGameSessions(out string gameID, string player1ID, string player2ID)
        {
            gameID = null;
            foreach (KeyValuePair<string, GameSession> Session in Sessions)
            {
                if (Session.Value.playerID2 == "waiting")
                {
                    gameID = Session.Key;
                    player2ID = Session.Value.playerID1;
                    Session.Value.playerID2 = player2ID;
                    Sessions[gameID].playerID1 = player1ID;
                    Sessions[gameID].playerID2 = player2ID;
                    break;
                }
            }
            return player2ID;
        }

        public List<string> GetPlayerIDS(string gameID) 
        {
            List<string> ids = new List<string>
            {
                Sessions[gameID].playerID1,
                Sessions[gameID].playerID2
            };
            return ids;
        }
    }
}
