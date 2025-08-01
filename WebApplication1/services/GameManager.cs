﻿using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using System.Diagnostics;
using System.Xml.XPath;
using WebApplication1.Controllers;

namespace WebApplication1.services
{
    public class GameManager
    {
        private readonly IHubContext<GameHub> _hubContext;
        private readonly IHubContext<KnoppenHub> _knoppenHubContext;

        public ConcurrentDictionary<string, GameState> Games = new();
        public ConcurrentDictionary<string, string> Connections = new();
        public ConcurrentDictionary<string, string> RaspConnections = new();

        private readonly object _connectionsLock = new object();
        private readonly object _sessionsLock = new object();

        public GameManager(IHubContext<GameHub> hubContext, IHubContext<KnoppenHub> knoppenHubContext)
        {
            _hubContext = hubContext;
            _knoppenHubContext = knoppenHubContext;
        }
        public async Task OnDisconnected(string connectionID)
        {
            foreach(KeyValuePair<string,string> connection in Connections)
            {
                if (connection.Value.Equals(connectionID))
                {
                    string playerID = connection.Key;
                    await GetGameToRemove(playerID);
                    await RemoveConnection(playerID);
                    return;
                }
            }
        }
        public async Task OnDisconnectedRasp(string connectionID)
        {
            Console.WriteLine("Deleting all raspberry connections");
            RaspConnections.Clear();
        }
        public async Task GetGameToRemove(string playerID)
        {
            string gameID = null;
            foreach(KeyValuePair<string,GameState> game in Games)
            {     
                if (game.Value.playerID1 == playerID || game.Value.playerID2 == playerID)
                {
                    gameID = game.Key;
                    string otherPlayerID = (game.Value.playerID1 == playerID)
                        ? game.Value.playerID2
                        : game.Value.playerID1;

                    await game.Value.StopTimer();
                    await RemoveGame(gameID);
                    await RemoveConnection(otherPlayerID);
                    return;
                }
            }
        }
        public Task RemoveGame(string gameID)
        {
            Games[gameID] = null;
            Games.TryRemove(gameID, out _);
            return Task.CompletedTask;
        }

        public async Task IncreaseTimer(string gameID)
        {
            Games[gameID].IncreaseTimer();
            foreach (var raspConnection in RaspConnections)
            {
                Console.WriteLine(raspConnection.Value);
                await _knoppenHubContext.Clients.Client(raspConnection.Value).SendAsync("Fout", "ping");
            }
        }
        public async Task RemoveConnection(string playerID)
        {
            await _hubContext.Clients.Client(Connections[playerID]).SendAsync("Disconnected");
            Connections.TryRemove(playerID, out _);
        }
        public async Task CreateGame(string player1ID, string player2ID,int gameNumber, GameState newState)
        {
            Games.TryAdd(newState.ID, newState);
            newState.StartTimer();

            if (gameNumber == 1)
            {
                await _hubContext.Clients.Client(Connections[player1ID]).SendAsync("StartGame", newState.ID, gameNumber);
                await _hubContext.Clients.Client(Connections[player2ID]).SendAsync("StartGame", newState.ID, gameNumber);
            }
            else if (gameNumber == 2) 
            {
                await _hubContext.Clients.Client(Connections[player1ID]).SendAsync("StartGame", newState.LGD, newState.ID, player1ID, 1);
                await _hubContext.Clients.Client(Connections[player2ID]).SendAsync("StartGame", newState.LGD, newState.ID, player2ID, 2);
            }
            else
            {
                await _hubContext.Clients.Client(Connections[player1ID]).SendAsync("StartCGame", newState.CGD.uniquePictureInts, gameNumber);
                await _hubContext.Clients.Client(Connections[player2ID]).SendAsync("StartCGame", newState.CGD.uniquePictureInts, gameNumber);
            }
        }
        public async Task StartGame2(string gameID)
        {
            GameState state = Games[gameID];
            state.StartGame2();
            await _hubContext.Clients.Client(Connections[state.playerID1]).SendAsync("StartGame2", state.LGD);
            await _hubContext.Clients.Client(Connections[state.playerID2]).SendAsync("StartGame2", state.LGD);
        }
        public async Task CreateConnectionGame(GameState newState)
        {
            Games.TryAdd(newState.ID, newState);
            newState.StartTimer();
            await _hubContext.Clients.Client(Connections[newState.playerID1]).SendAsync("StartCGame", newState);
            await _hubContext.Clients.Client(Connections[newState.playerID2]).SendAsync("StartCGame", newState);
        }
        public async Task SpawnWaves(string gameID)
        {
            string playerID1 = Games[gameID].playerID1;
            string playerID2 = Games[gameID].playerID2;
            GameState Statedata = Games[gameID];

            await _hubContext.Clients.Client(Connections[playerID2]).SendAsync("SpawnWaves", Statedata.WGD);
            await _hubContext.Clients.Client(Connections[playerID1]).SendAsync("SpawnWaves", Statedata.WGD);
        }

        public async Task JoinGame(string connectionID, int playerNumber, int gameNumber)
        {
            if (playerNumber == 1)
            {
                string player1ID = Guid.NewGuid().ToString();
                Connections.TryAdd(player1ID, connectionID);
                await CheckGameStates1(player1ID, gameNumber);
            }
            
            else if(playerNumber == 2)
            {
                string player2ID = Guid.NewGuid().ToString();
                Connections.TryAdd(player2ID, connectionID);
                await CheckGameStates2(player2ID, gameNumber);
            }

            
        }

        public async Task SendResponse(string gameID) 
        {
            string playerID1 = Games[gameID].playerID1;
            string playerID2 = Games[gameID].playerID2;
            GameState currentState = Games[gameID];
            await _hubContext.Clients.Client(Connections[playerID1]).SendAsync("Response", currentState.LGD.currentButton);
            await _hubContext.Clients.Client(Connections[playerID2]).SendAsync("Response", currentState.LGD.currentButton);
        }
       
        public async Task SendResponseMovement(string gameID, float xPos, float yPos)
        {
            string playerID1 = Games[gameID].playerID1;
            string playerID2 = Games[gameID].playerID2;
            GameState currentState = Games[gameID];
            await _hubContext.Clients.Client(Connections[playerID1]).SendAsync("ResponseMovement", xPos, yPos);
            await _hubContext.Clients.Client(Connections[playerID2]).SendAsync("ResponseMovement", xPos, yPos);
        }

        public async Task CheckGameStates1(string playerID, int gameNumber)
        {
            foreach (KeyValuePair<string, GameState> Game in Games)
            {
                if (Game.Value.playerID1 == "waiting")
                {
                    Game.Value.playerID1 = playerID;
                    await CreateGame(Game.Value.playerID1, Game.Value.playerID2, gameNumber, Game.Value);
                    return;
                }
            }

            string gameID = Guid.NewGuid().ToString();
            GameState session = new GameState(this, gameID, gameNumber)
            {
                playerID1 = playerID,
                playerID2 = "waiting"
            };
            Games.TryAdd(gameID, session);
        }
        public async Task CheckGameStates2(string playerID, int gameNumber)
        {
            foreach (KeyValuePair<string, GameState> Game in Games)
            {
                if (Game.Value.playerID2 == "waiting")
                {
                    Game.Value.playerID2 = playerID;
                    await CreateGame(Game.Value.playerID1, Game.Value.playerID2, gameNumber, Game.Value);
                    return;
                }
            }

            string gameID = Guid.NewGuid().ToString();
            GameState session = new GameState(this, gameID, gameNumber)
            {
                playerID1 = "waiting",
                playerID2 = playerID
            };
            Games.TryAdd(gameID, session);
        }

        public List<string> GetPlayerIDS(string gameID) 
        {
            List<string> ids = new List<string>
            {
                Games[gameID].playerID1,
                Games[gameID].playerID2
            };
            return ids;
        }

        public async Task SendTime(GameState currentState)
        {
            string playerID1 = currentState.playerID1;
            string playerID2 = currentState.playerID2;


            await _hubContext.Clients.Client(Connections[playerID1]).SendAsync("Timer", currentState.timeSinceStart);
            await _hubContext.Clients.Client(Connections[playerID2]).SendAsync("Timer", currentState.timeSinceStart);
        }
        public async Task TimeError(GameState gameState)
        {
            string playerID1 = gameState.playerID1;
            string playerID2 = gameState.playerID2;

            await _hubContext.Clients.Client(Connections[playerID1]).SendAsync("TimerError", gameState.timeSinceStart);
            await _hubContext.Clients.Client(Connections[playerID2]).SendAsync("TimerError", gameState.timeSinceStart);
        }




        public async Task Level1Complete(string gameID)
        {
            GameState state = Games[gameID];

            string playerID1 = state.playerID1;
            string playerID2 = state.playerID2;

            await _hubContext.Clients.Client(Connections[playerID1]).SendAsync("SendLevel1Complete");
            await _hubContext.Clients.Client(Connections[playerID2]).SendAsync("SendLevel1Complete");
        }
        public async Task Level2Complete(string gameID)
        {
            GameState state = Games[gameID];

            string playerID1 = state.playerID1;
            string playerID2 = state.playerID2;

            await _hubContext.Clients.Client(Connections[playerID1]).SendAsync("SendLevel2Complete");
            await _hubContext.Clients.Client(Connections[playerID2]).SendAsync("SendLevel2Complete");

            foreach (var raspConnection in RaspConnections)
            {
                Console.WriteLine("sending to start game3");
                await _knoppenHubContext.Clients.Client(raspConnection.Value).SendAsync("Speldrie", "ping");
            }
        }
        public async Task Level3Complete(string gameID)
        {
            GameState state = Games[gameID];

            string playerID1 = state.playerID1;
            string playerID2 = state.playerID2;

            await _hubContext.Clients.Client(Connections[playerID1]).SendAsync("StartGame4");
            await _hubContext.Clients.Client(Connections[playerID2]).SendAsync("StartGame4");
        }

        public async Task Level4Complete(string gameID)
        {
            GameState state = Games[gameID];

            await state.GameWon();
        }

        public async Task RaspLevel3Complete()
        {
            foreach (var game in Games)
            {
                GameState state = game.Value;

                string playerID1 = state.playerID1;
                string playerID2 = state.playerID2;

                Console.WriteLine("Starting game 4");

                await _hubContext.Clients.Client(Connections[playerID1]).SendAsync("StartGame4");
                await _hubContext.Clients.Client(Connections[playerID2]).SendAsync("StartGame4");
            }
        }

        public async Task SendGameEnd(GameState state)
        {
            string playerID1 = state.playerID1;
            string playerID2 = state.playerID2;

            await _hubContext.Clients.Client(Connections[playerID1]).SendAsync("GameComplete",state.timeSinceStart);
            await _hubContext.Clients.Client(Connections[playerID2]).SendAsync("GameComplete", state.timeSinceStart);
        }

        public async Task MovementFromRaspBerryPi(string button)
        {
            foreach (var game in Games)
            {
                GameState state = game.Value;

                string playerID1 = state.playerID1;
                string playerID2 = state.playerID2;
                switch (button)
                {
                    case "button1":
                        await _hubContext.Clients.Client(Connections[playerID1]).SendAsync("RaspMovement", "right");
                        break;
                    case "button2":
                        await _hubContext.Clients.Client(Connections[playerID1]).SendAsync("RaspMovement", "left");
                        break;
                    case "button3":
                        await _hubContext.Clients.Client(Connections[playerID1]).SendAsync("RaspMovement", "down");
                        break;
                    case "button4":
                        await _hubContext.Clients.Client(Connections[playerID1]).SendAsync("RaspMovement", "up");
                        break;
                }
            }

            
        }

        public async Task NewRaspberryPI(string connectionID , string playerID)
        {
            RaspConnections.TryAdd(playerID, connectionID);     

            await _hubContext.Clients.Client(connectionID).SendAsync("Connected", "ping");
        }
    }
}
