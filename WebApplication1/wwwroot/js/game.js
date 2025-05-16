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

const start1BTN = document.getElementById('start1BTN');
const start2BTN = document.getElementById('start2BTN');

const wave1 = document.getElementById('wave1')
const compute = window.getComputedStyle(wave1);
const wave2 = document.getElementById('wave2')
const compute2 = window.getComputedStyle(wave2);
const fakeWave = document.getElementById('fakeWave');

let gameID = null;
let playerNumber = null;

const connection = new signalR.HubConnectionBuilder().withUrl("/gamehub").build();

function Connect(playerNumber) {
    connection.start().then(() => {
        connection.invoke("JoinGame", playerNumber, 1);
    });
}
connection.onclose(error => {
    console.error('WebSocket closed:', error);
    // Attempt reconnection or show error to user
});


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
    gameID = gameId;
    document.getElementById('gameOverMessage').style.display = 'none';
    winMessage.style.display = 'none'; // Hide win message
    animateWaves();
    
});

connection.on('SpawnWaves', function (WGD) {
    spawnWaves(WGD.xPosWave1, WGD.xPosWave2, WGD.yPosWave);
});

connection.on("ResponseMovement", function (xPos, yPos) {
    if (playerNumber === 1) {

    } else if (playerNumber === 2) {
        player.y = yPos;
        player.x = xPos;
    }
});


function SendMovement(xPos, yPos) {
    if (connection.state === signalR.HubConnectionState.Connected) {
        connection.invoke("SendMovement", xPos, yPos, gameID);
    } else {
        console.log("No connection");
    }
    
}
function respawnWave() {
    if (connection.state === signalR.HubConnectionState.Connected) {
        connection.invoke('RespawnWave', gameID).catch();
    } else {
        console.log("No connection");
    }

}

function startGame1() {
    console.log("playerNumber is:", playerNumber);
    if (playerNumber === null) {
        start1BTN.style.display = 'none';
        start2BTN.style.display = 'none';
        Connect(1);
        playerNumber = 1;
    }    
}
function startGame2() {
    console.log("playerNumber is:", playerNumber);
    if (playerNumber === null) {
        start1BTN.style.display = 'none';
        start2BTN.style.display = 'none';
        Connect(2);
        playerNumber = 2;
    }
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

function spawnWaves(xPos1, xPos2, yPos) {
    wave1data.x = xPos1;
    wave2data.x = xPos2;
    wave1.style.left = wave1data.x + "px";
    wave2.style.left = wave2data.x + "px";
    fakeWave.style.left = "0px";
    wave1data.y = yPos;
    wave2data.y = yPos;
    wave2.style.top = wave1data.y + "px";
    wave1.style.top = wave1data.y + "px";
    fakeWave.style.top = wave1data.y + "px";
}


function animateWaves() {
    function update() {
        wave1data.y += 2;
        wave2data.y += 2;
        wave2.style.top = wave2data.y + "px";
        wave1.style.top = wave1data.y + "px";
        fakeWave.style.top = wave1data.y + "px";

        if (wave1data.y >= 400) {
            respawnWave();
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
function collision(a, b) {
    if (a.x + (a.width / 2) > b.x &&
        a.x  < b.x + b.width )
    {   
        if (a.y - a.height < b.y + (b.height / 2) &&
        a.y + a.height > b.y - (b.height / 2)) {
            player.y = 360;
            respawnWave();
        }      
    }
}






