let lives = 3;
let player = { x: 284, y: 360, width: 32, height: 32 };
const playerElement = document.getElementById('player');
const fakePlayer = document.getElementById('fakePlayer');
const waveContainer1 = document.getElementById('gameArea1');
const waveContainer2 = document.getElementById('gameArea2');
const winMessage = document.getElementById('winMessage');
const restartBTN = document.getElementById('restartBtn');

const wave1 = document.getElementById('wave1')
const compute = window.getComputedStyle(wave1);
const wave2 = document.getElementById('wave2')
const compute2 = window.getComputedStyle(wave2);

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
        
        enableMovement();
    } else if (playerNumber === 2) {
        console.log("player2");
        waveContainer2.style.display = 'block';
        fakePlayer.style.left = "284px";
        fakePlayer.style.top = "360px";
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
        fakePlayer.style.left = xPos + "px";
        fakePlayer.style.top = yPos + "px";
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
                SendMovement(player.x, player.y); break;
            case 'd': player.x += step;
                SendMovement(player.x, player.y); break;
            case 'w': player.y -= step;
                SendMovement(player.x, player.y); break;
            case 's': player.y += step;
                SendMovement(player.x, player.y); break;
        }
        player.x = Math.max(0, Math.min(player.x, 568));
        player.y = Math.max(0, Math.min(player.y, 368));
        playerElement.style.left = player.x + "px";
        playerElement.style.top = player.y + "px";
    };
}

function spawnWaves() {
    let xSpawn = Math.floor(Math.random() * 501) - 250;
    wave1.style.left = xSpawn + "px";
    wave2.style.left = (xSpawn + 580) + "px";
    wave3.style.left = xSpawn + "px";
    wave4.style.left = (xSpawn + 580) + "px";
}

function animateWaves() {
    function update() {
        let waveY = parseFloat(compute.top);
        console.log(waveY);
        waveY += 2;
        wave2.style.top = waveY + "px";
        wave1.style.top = waveY + "px";
        wave4.style.top = waveY + "px";
        wave3.style.top = waveY + "px";

        if (waveY >= 400) {
            spawnWaves();
            wave2.style.top = "0px";
            wave1.style.top = "0px";
            wave4.style.top = "0px";
            wave3.style.top = "0px";
        }
        
       requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

function checkCollision(a, b) {
    return !(
        a.x + a.width < b.x ||
        a.x > b.x + 32 ||
        a.y + a.height < b.y ||
        a.y > b.y + 32
    );
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



