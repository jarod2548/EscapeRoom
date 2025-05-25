const gameScreen = document.getElementById('gameScreen');
const player1BTN = document.getElementById('player1Button');
const player2BTN = document.getElementById('player2Button');
const lights1 = document.querySelectorAll('.lightVersion1');
const lights2 = document.querySelectorAll('.lightVersion2');
const lights3 = document.querySelectorAll('.lightVersion3');
const lights4 = document.querySelectorAll('.lightVersion4');

const exampleLight1 = document.getElementById('exampleLight1');
const exampleLight2 = document.getElementById('exampleLight2');


let playerID = null;
let buttonsToUse;

let gameOrder = 0;

const colors = ['#ff6347', '#4682b4', '#32cd32', '#ffb6c1'];
const rickColors = [[0, 3, 2, 1], [0, 2, 3, 1], [2, 3, 0, 1], [2, 1, 3, 0]]
const wrongColors = [[0, 3, 2, 1], [2, 3, 0, 1], [2, 3, 0, 1], [2, 1, 3, 0]]


window.connection.on("StartGame2", function (LGD) {
    buttonsToUse = LGD.buttonToUse;
    console.log(buttonsToUse);
    gameScreen.style.display = 'block';
    if (window.playerNumber === 1) {  
        gameArea3.style.display = 'grid';
        drawExampleLights(buttonsToUse);
    } else
    {
        gameArea2.style.display = 'grid';
        drawLights(rickColors);
    }
    
});

window.connection.on("Response", function (currentButton) {
    console.log("currentButton :", currentButton);
    gameOrder = currentButton;
});


function sendMove(move) {
    window.connection.invoke("MakeMove", gameId, move);
}



window.player1Start = function()
{
    console.log("game 2: player 1 start");
    window.connection.invoke("StartGame2", window.gameID);
}
window.player2Start = function() {

}

function shapePressed(shapeNumber)
{
    connection.invoke("ShapePressed", shapeNumber, gameOrder, gameID);
}
function drawLights(colorInts)
{
    console.log(colorInts[0]);
    console.log(colorInts[1]);
    console.log(colorInts[2]);
    console.log(colorInts[3]);
    drawDonuts(lights1, colorInts[0]);
    drawDonuts(lights2, colorInts[1]);
    drawDonuts(lights3, colorInts[2]);
    drawDonuts(lights4, colorInts[3]);
}

function drawExampleLights(buttonList) {
    drawDonut(exampleLight1, buttonList[0]);
    drawDonut(exampleLight2, buttonList[1]);
}

function getRandomColors(colorsInts)
{
    let selectedColors = [];
    // Clone the array to avoid mutation issues
    let clonedColorInts = [...colorsInts];

    for (let i = 0; i < clonedColorInts.length; i++) {
        let color = colors[clonedColorInts[i]];
        selectedColors.push(color);
    }
    return selectedColors;
}
//functie gemaakt met AI
function drawDonuts(canvasElements, colorInts)
{
    console.log(colorInts);
    let newColors = getRandomColors(colorInts);
    console.log("newColors", newColors)
    for (let i = 0; i < canvasElements.length; i++) {
        const ctx = canvasElements[i].getContext('2d');

        const centerX = canvasElements[i].width / 2;
        const centerY = canvasElements[i].height / 2;
        const outerRadius = 50;
        const innerRadius = 40;





        // Clear canvas
        ctx.clearRect(0, 0, canvasElements[i].width, canvasElements[i].height);

        for (let j = 0; j < 4; j++) {
            let startAngle = ((j * Math.PI) / 2) + (Math.PI / 4);
            let endAngle = (((j + 1) * Math.PI) / 2) + (Math.PI / 4);

            ctx.beginPath();
            // Outer arc
            ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle, false);
            // Inner arc (in reverse)
            ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
            ctx.closePath();
            ctx.fillStyle = newColors[j];
            ctx.fill();
        }

    }
}
function drawDonut(canvasElement, shapeInt) {
    let colorInts = wrongColors[shapeInt];
    
    let newColors = getRandomColors(colorInts);
        const ctx = canvasElement.getContext('2d');

        const centerX = canvasElement.width / 2;
        const centerY = canvasElement.height / 2;
        const outerRadius = 50;
    const innerRadius = 40;

        // Clear canvas
        ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

        for (let i = 0; i < 4; i++) {
            const startAngle = ((i * Math.PI) / 2) + (Math.PI / 4);
            const endAngle = (((i + 1) * Math.PI) / 2) + (Math.PI / 4);


            ctx.beginPath();
            // Outer arc
            ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle, false);
            // Inner arc (in reverse)
            ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
            ctx.closePath();
            ctx.fillStyle = newColors[i];
            ctx.fill();
        }
}