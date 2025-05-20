using Microsoft.AspNetCore.SignalR;
using System.Diagnostics;
using System.Timers;
using WebApplication1.services;

namespace WebApplication1
{
    public class GameState
    {

        private readonly GameManager _gameManager;
        private object timeLock = new object();

        public GameState(GameManager gameManager ,string gameID, int gameNumber) 
        {
            _gameManager = gameManager;
            ID = gameID;
            timer = new System.Timers.Timer(1000);
            timer.Elapsed += UpdateTimer;
            
            if (gameNumber == 1)
            {
                WGD = new();
                
                WGD = new WaveGameData();
                SpawnWaves();
            }
            else if (gameNumber == 2) 
            {
                LGD = new LightsGameData();
                LGD = new();
                
                CreateLightsGame();
            }
            else
            {
                CGD = new();
                CreateConnectionGamedata();
            }
                
        }
        public void StartTimer()
        {
            timer.Start();
        }
        private void UpdateTimer(object sender, ElapsedEventArgs e)
        {
            lock(timeLock)
            {
                timeSinceStart++;
            }    
            _gameManager.SendTime(this);
            Console.WriteLine(timeSinceStart.ToString());
            Debug.WriteLine(timeSinceStart.ToString());
        }
        public void IncreaseTimer()
        {
            lock (timeLock)
            {
                timeSinceStart += 10;
            }     
            _gameManager.TimeError(this);
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
        public class ConnectionGamedata()
        {
            public List<int> uniquePictureInts = new List<int>();


        }

        public string ID {  get; set; }

        public int timeSinceStart { get; set; }
        private System.Timers.Timer timer {  get; set; }

        public WaveGameData WGD { get; set; }

        public LightsGameData LGD { get; set; }
        public ConnectionGamedata CGD { get; set; }
        public required string playerID1 { get; set; }
        public required string playerID2 { get; set; }






        Random rand = new Random();

        public async Task SpawnWaves()
        {
            WGD.xPosWave1 = rand.Next(-500, 0);
            WGD.xPosWave2 = WGD.xPosWave1 + 580;
            WGD.yPosWave = 0;

            await _gameManager.SpawnWaves(this.ID);
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
        public void CreateConnectionGamedata()
        {
            HashSet<int> ints = new HashSet<int>();
            while(ints.Count < 3)
            {
                ints.Add(rand.Next(0, 3));
            }
            CGD.uniquePictureInts = ints.ToList();
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
        public async Task StopTimer()
        {
            timer.Stop();
        }
    }
}
