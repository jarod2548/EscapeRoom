let lives = 3;
const player = {
    x: 284,
    y: 360,
    width: 32,
    height: 32
};

const wave1data = {
    height: 64,
    width: 520,
    x: 0,
    y: 0
}
const wave2data = {
    height: 64,
    width: 520,
    x: 0,
    y: 0
}
const playerElement = document.getElementById('player');
const waveContainer1 = document.getElementById('gameArea1');
const winMessage = document.getElementById('winMessage');
const restartBTN = document.getElementById('restartBtn');

const wave1 = document.getElementById('wave1')
const compute = window.getComputedStyle(wave1);
const wave2 = document.getElementById('wave2')
const compute2 = window.getComputedStyle(wave2);
const fakeWave = document.getElementById('fakeWave');

let gameID = null;
let playerNumber = null;

let waves = [];
const waveCount = 1;
const connection = new signalR.HubConnectionBuilder().withUrl("/gamehub").build();

function Connect(playerNumber) {
    connection.start().then(() => {
        connection.invoke("JoinGame", playerNumber, 1);
    });
}


connection.on("StartGame", function (gameId, gameNumber) {
    console.log("playerNumber is:", playerNumber);
    if (playerNumber === 1) {   
        console.log("player1");
        waveContainer1.style.display = 'block';
        fakeWave.style.display = 'block';
        
        enableMovement();
    } else if (playerNumber === 2) {
        console.log("player2");
        waveContainer1.style.display = 'block';
    }
    console.log("run game logic");
    gameID = gameId;
    document.getElementById('gameOverMessage').style.display = 'none';
    winMessage.style.display = 'none'; // Hide win message
    restartBTN.style.display = 'none';  // Hide restart button initially
    spawnWaves();
    animateWaves();
    
});

connection.on("ResponseMovement", function (xPos, yPos) {
    if (playerNumber === 1) {

    } else if (playerNumber === 2) {
        player.y = yPos;
        player.x = xPos;
    }
});


function SendMovement(xPos, yPos) {
    connection.invoke("SendMovement", xPos, yPos, gameID);
}


function startGame1() {
    console.log("playerNumber is:", playerNumber);
    if (playerNumber === null) {
        
        Connect(1);
        playerNumber = 1;
        console.log("playerNumber is:", playerNumber);
    }    
}
function startGame2() {
    console.log("playerNumber is:", playerNumber);
    if (playerNumber === null) {

        Connect(2);
        playerNumber = 2;
        console.log("playerNumber is:", playerNumber);
    }
}
function startgame2() {
    document.getElementById('gameOverMessage').style.display = 'none';
    winMessage.style.display = 'none'; // Hide win message
    restartBTN.style.display = 'none';  // Hide restart button initially
    spawnWaves();
    animateWaves();
    Connect(2);
}

function enableMovement() {
    document.onkeydown = function (event) {
        const step = 10;
        switch (event.key.toLowerCase()) {
            case 'a': player.x -= step;
                 break;
            case 'd': player.x += step; break;
            case 'w': player.y -= step; break;
            case 's': player.y += step; break;
        }
        player.x = Math.max(0, Math.min(player.x, 568));
        player.y = Math.max(0, Math.min(player.y, 368));
        
    };
}

function spawnWaves() {
    wave1data.x = Math.floor(Math.random() * 501) - 500;
    wave2data.x = wave1data.x + 580
    wave1.style.left = wave1data.x + "px";
    wave2.style.left = wave2data.x + "px";
    fakeWave.style.left = "0px";
}

function animateWaves() {
    function update() {
        wave1data.y += 2;
        wave2data.y += 2;
        wave2.style.top = wave2data.y + "px";
        wave1.style.top = wave1data.y + "px";
        fakeWave.style.top = wave1data.y + "px";

        if (wave1data.y >= 400) {
            resetWave();
        }
        
        collision(player, wave1data);
        collision(player, wave2data);
        playerElement.style.left = player.x + "px";
        playerElement.style.top = player.y + "px";
        SendMovement(player.x, player.y);
       requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

function resetWave() {
    spawnWaves();
    wave1data.y = 0;
    wave2data.y = 0;
    wave2.style.top = "0px";
    wave1.style.top = "0px";
    fakeWave.style.top = "0px";
}
function collision(a, b) {
    if (a.x + (a.width / 2) > b.x &&
        a.x  < b.x + b.width )
    {   
        if (a.y - a.height < b.y + (b.height / 2) &&
        a.y + a.height > b.y - (b.height / 2)) {
            player.y = 360;
            resetWave();
        }      
    }
}


function gameOverLogic() {
    document.getElementById('gameOverMessage').style.display = 'block';
    document.getElementById('restartBtn').style.display = 'inline';  
    document.onkeydown = null;
}

function restartGame() {
    lives = 3;
    document.getElementById('liveContainer').innerHTML = `

        <img src="images/heart.png" class="life">
        <img src="images/heart.png" class="life">
        <img src="images/heart.png" class="life">
    `;

    player.x = 284;
    player.y = 360;
    playerElement.style.left = player.x + "px";
    playerElement.style.top = player.y + "px";

    document.getElementById('gameOverMessage').style.display = 'none';
    document.getElementById('winMessage').style.display = 'none'; 
    document.getElementById('restartBtn').style.display = 'none';  

    spawnWaves();
    animateWaves();
    enableMovement();
}



