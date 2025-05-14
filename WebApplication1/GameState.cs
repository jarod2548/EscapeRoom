using Microsoft.AspNetCore.SignalR;
using WebApplication1.services;

namespace WebApplication1
{
    public class GameState
    {
        private readonly IHubContext<GameHub> _hubContext;
        private readonly GameManager _gameManager;

        public GameState(IHubContext<GameHub> hubContext, GameManager gameManager ,string gameID, int gameNumber) 
        {
            _hubContext = hubContext;
            _gameManager = gameManager;
            ID = gameID;
            if (gameNumber == 1)
            {
                CreateWaveGame();
            }
            else
            {
                CreateLightsGame();
            }
                
        }

        public string ID {  get; set; }

        public int currentButton { get; set; }
        public int button1 { get; set; }
        public int button2 { get; set; }

        public int randomInt { get; set; }

        public List<int[]> buttons = new List<int[]>
        {
            new int[]{0,1},
            new int[]{2,3},
            new int[]{1,2},
            new int[]{0,3},
            new int[]{3,1},
        };

        public List<int> buttonToUse = new List<int>();

        public List<List<int>> colors = new List<List<int>>();

        Random rand = new Random();

        public void CreateWaveGame()
        {

        }
        public void CreateLightsGame() 
        {                     
            randomInt = rand.Next(buttons.Count);
            button1 = buttons[randomInt][0];
            button2 = buttons[randomInt][1];
            currentButton = 0;
            buttonToUse.Add(button1);
            buttonToUse.Add(button2);
            CreateColors();
        }

        public void CreateColors()
        {     
            for (int i = 0; i < 4; i++)
            {
                HashSet<int> colorInts = new HashSet<int>();
                while (colorInts.Count < 4)
                {
                    int num = rand.Next(1, 5);
                    colorInts.Add(num);
                }
                colors.Add(colorInts.ToList());
            }
        }

        public async Task SendMovement(float xPos, float yPos)
        {
            await _gameManager.SendResponseMovement(ID,xPos, yPos);
        }
        public async Task CheckLights(int BTNpressed, int gameOrder) 
        {
            Console.WriteLine("Button pressed on site");
            if (buttonToUse[gameOrder] == BTNpressed) 
            { 
                Console.WriteLine("Correct button");
                currentButton++;
                await _gameManager.SendResponse(this.ID);
                
            }
            else 
            {
                Console.WriteLine("Wrong button");
            }
        }

    }
}
