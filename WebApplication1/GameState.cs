using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
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
                WGD = new();
                CreateWaveGame();
            }
            else
            {
                LGD = new();
                CreateLightsGame();
            }
                
        }
        public class WaveGameData()
        {
            public float xPosWave1 { get; set; }
            public float xPosWave2 { get; set; }
            public float yPosWave { get; set; }
        }

        public class LightsGameData()
        {
            public int currentButton { get; set; }
            public int button1 { get; set; }
            public int button2 { get; set; }

            public int randomInt { get; set; }

            public List<int[]> buttons { get; set; } = new List<int[]>
        {
            new int[]{0,1},
            new int[]{2,3},
            new int[]{1,2},
            new int[]{0,3},
            new int[]{3,1},
        };

            public List<int> buttonToUse { get; set; } = new List<int>();

            public List<List<int>> colors { get; set; } = new List<List<int>>();
        }

        public string ID {  get; set; }

        public WaveGameData WGD { get; set; }

        public LightsGameData LGD { get; set; }

        

        Random rand = new Random();

        public async Task CreateWaveGame()
        {
            WGD.xPosWave1 = rand.Next(-500, 501);
            WGD.xPosWave2 = WGD.xPosWave1 + 580;
            WGD.yPosWave = 0;
        }
        public void CreateLightsGame() 
        {                     
            LGD.randomInt = rand.Next(LGD.buttons.Count);
            LGD.button1 = LGD.buttons[LGD.randomInt][0];
            LGD.button2 = LGD.buttons[LGD.randomInt][1];
            LGD.currentButton = 0;
            LGD.buttonToUse.Add(LGD.button1);
            LGD.buttonToUse.Add(LGD.button2);
            CreateColors();
        }

        public void CreateColors()
        {     

            while(LGD.colors.Count < 4)
            {
                HashSet<int> colorInts = new HashSet<int>();
                while (colorInts.Count < 4)
                {
                    int num = rand.Next(1, 5);
                    colorInts.Add(num);
                }
                if(!LGD.colors.Any(exist => exist.SequenceEqual(colorInts)))
                {
                    LGD.colors.Add(colorInts.ToList());
                }
            }
        }

        public async Task SendMovement(float xPos, float yPos)
        {
            await _gameManager.SendResponseMovement(ID,xPos, yPos);
        }
        public async Task CheckLights(int BTNpressed, int gameOrder) 
        {
            Console.WriteLine("Button pressed on site");
            if (LGD.buttonToUse[gameOrder] == BTNpressed) 
            { 
                Console.WriteLine("Correct button");
                LGD.currentButton++;
                await _gameManager.SendResponse(this.ID);
                
            }
            else 
            {
                Console.WriteLine("Wrong button");
            }
        }

    }
}
