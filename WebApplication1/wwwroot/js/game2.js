const gameScreen = document.getElementById('gameScreen');
const gameArea1 = document.getElementById('gameArea1');
const gameArea2 = document.getElementById('gameArea2');
const player1BTN = document.getElementById('player1Button');
const player2BTN = document.getElementById('player2Button');
const lights1 = document.querySelectorAll('.lightVersion1');
const lights2 = document.querySelectorAll('.lightVersion2');
const lights3 = document.querySelectorAll('.lightVersion3');
const lights4 = document.querySelectorAll('.lightVersion4');

let gameID = null;
let playerID = null;

const colors = ['#ff6347', '#4682b4', '#32cd32', '#ffb6c1', '#ff1493', '#8a2be2'];

//.withURL(*our server domain*)
const connection = new signalR.HubConnectionBuilder().withUrl("/gamehub").build();

//functie gemaakt met AI
function Connect(playerNumber)
{
    connection.start().then(() => {
        connection.invoke("JoinGame", playerNumber);
    });   
}
connection.on("UpdateGame", (gameState) => {

});
connection.on("StartGame", function (list, stateID, playerID, playerNumber) {
    console.log("Received gamedata : ", list);
    console.log("game ID :", stateID)
    console.log("player ID: ", playerID)
    gameScreen.style.display = 'block';
    if (playerNumber === 1) {  
        gameArea1.style.display = 'grid';
    } else
    {
        gameArea2.style.display = 'grid';
    }
    
    gameID = stateID; 
    drawLights(list);
});
function sendMove(move) {
    connection.invoke("MakeMove", gameId, move);
}



function player1Start()
{
    if (gameScreen.style.display === 'none')
    {
        Connect(1);
    }
}
function player2Start() {
    if (gameScreen.style.display === 'none') {
        Connect(2);
    }
}

function shapePressed(shapeNumber)
{
    connection.invoke("ShapePressed", shapeNumber, gameID);
}
function drawLights(colorInts)
{
    for (let i = 0; i < colorInts.length; i++)
    {

    }

    drawDonuts(lights1, colorInts[0]);
    drawDonuts(lights2, colorInts[1]);
    drawDonuts(lights3, colorInts[2]);
    drawDonuts(lights4, colorInts[3]);
}

function getRandomColors(colorsInts)
{
    let selectedColors = [];
    for (let i = 0; i < colorsInts.length; i++) {
        const color = colors[colorsInts[i]];
        if (!selectedColors.includes(color)) {
            selectedColors.push(color);
        }
    }
    return selectedColors;
}
//functie gemaakt met AI
function drawDonuts(canvasElements, colorInts) {
    let colors = getRandomColors(colorInts);
    for (let i = 0; i < canvasElements.length; i++)
    {
        const ctx = canvasElements[i].getContext('2d');

        const centerX = canvasElements[i].width / 2;
        const centerY = canvasElements[i].height / 2;
        const outerRadius = 50;
        const innerRadius = 40;



        // Clear canvas
        ctx.clearRect(0, 0, canvasElements[i].width, canvasElements[i].height);

        for (let i = 0; i < 4; i++) {
            const startAngle = (i * Math.PI) / 2;
            const endAngle = ((i + 1) * Math.PI) / 2;


            ctx.beginPath();
            // Outer arc
            ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle, false);
            // Inner arc (in reverse)
            ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
            ctx.closePath();
            ctx.fillStyle = colors[i];
            ctx.fill();
    }   
    }
}