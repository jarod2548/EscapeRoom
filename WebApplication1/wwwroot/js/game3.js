const picture1 = document.getElementById('picture1');
const picture2 = document.getElementById('picture2');
const picture3 = document.getElementById('picture3');
const picture4 = document.getElementById('picture4');

const pictureList = [ picture1, picture2, picture3 ];

const gameScreen = document.getElementById('gameScreen');

const start1BTN = document.getElementById('start1BTN');
const start2BTN = document.getElementById('start2BTN');
const timerBox = document.getElementById('timerBox');

let playerNumber = 0;
let gameNumber = 0;

const connection = new signalR.HubConnectionBuilder().withUrl("/gamehub").build();

function Connect(playerNumber) {
    connection.start().then(() => {
        connection.invoke("JoinGame", playerNumber, 3);
    });
}
connection.onclose(error => {
    connection.stop();
    gameScreen.style.display = 'none';
    start1BTN.style.setProperty('display', 'inline-block', 'important');
    start2BTN.style.setProperty('display', 'inline-block', 'important');
    playerNumber = 0;
});

connection.on("StartCGame", function (ints, gameNumber) {
    gameScreen.style.display = 'grid'; 
    ShowPictures(ints);
    console.log(ints);
    console.log(gameNumber);
});
connection.on('Timer', function (time) {
    let hours = Math.floor(time / 3600);
    let minutes = Math.floor((time % 3600) / 60);
    let seconds = time % 60;

    timerBox.innerText = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
});
connection.on('Disconnected', function () {
    console.log("Other player disconnected");
    connection.stop();
    gameScreen.style.display = 'none';
    start1BTN.style.setProperty('display', 'inline-block', 'important');
    start2BTN.style.setProperty('display', 'inline-block', 'important');
    playerNumber = 0;
});

function StartCGame1() {
    if (playerNumber === 0) {
        start1BTN.style.display = 'none';
        start2BTN.style.display = 'none';
        Connect(1);
        playerNumber = 1;
    }
}
function StartCGame2() {
    if (playerNumber === 0) {
        start1BTN.style.display = 'none';
        start2BTN.style.display = 'none';
        Connect(2);
        playerNumber = 2;
    }
}
function ShowPictures(ints) {
    pictureList[ints[0]].style.gridColumn = "1/2";
    pictureList[ints[0]].style.gridRow = "1/2";

    pictureList[ints[1]].style.gridColumn = "3/4";
    pictureList[ints[1]].style.gridRow = "1/2";

    pictureList[ints[2]].style.gridColumn = "5/6";
    pictureList[ints[2]].style.gridRow = "1/2";
}

window.addEventListener('beforeunload', async () => {
    try {
        await connection.stop();  // Stops the connection
    } catch (error) {
        console.error("Error stopping SignalR connection:", error);
    }
});