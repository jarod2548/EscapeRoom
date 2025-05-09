namespace WebApplication1
{
    public class GameState
    {
        public GameState() 
        {
            CreateLightsGame();
        }

        public string ID {  get; set; }
        public int button1 { get; set; }
        public int button2 { get; set; }

        public void CreateLightsGame() 
        { 
            ID = Guid.NewGuid().ToString();
            button1 = 0;
            button2 = 1;
        }
        public async Task CheckLights(int BTNpressed) 
        {
            Console.WriteLine("Button pressed on site");
            if (BTNpressed == button1) 
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
