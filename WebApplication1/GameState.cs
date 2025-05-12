using WebApplication1.services;

namespace WebApplication1
{
    public class GameState
    {
        public GameState(string newID) 
        {
            ID = newID;
            CreateLightsGame();
        }

        public string ID {  get; set; }
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

        Random rand = new Random();

        public void CreateLightsGame() 
        {                     
            randomInt = rand.Next(buttons.Count);
            button1 = buttons[randomInt][0];
            button2 = buttons[randomInt][1];
            buttonToUse.Add(button1);
            buttonToUse.Add(button2);
            
        }
        public async Task CheckLights(int BTNpressed, int gameOrder) 
        {
            Console.WriteLine("Button pressed on site");
            if (buttonToUse[gameOrder] == BTNpressed) 
            { 
                Console.WriteLine("Correct button");
            }
            else 
            {
                Console.WriteLine("Wrong button");
            }
        }

    }
}
