let gameOver = false;
let lives = 3;
const victoryMessage = document.getElementById('victoryMessage');
const nextGameBTN = document.getElementById('nextGameBTN');

const protocol = window.location.protocol;
const ws = null;

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

let lastTime = 0;
let deltaTime = 0;
const fps = 60;
const interval = 1000 / fps;

const playerElement = document.getElementById('player');
window.gameArea1 = document.getElementById('gameArea1');
window.gameArea2 = document.getElementById('gameArea2');
window.gameArea3 = document.getElementById('gameArea3');
window.gameArea4 = document.getElementById('gameArea4');
window.gameArea5 = document.getElementById('gameArea5');

const start1BTN = document.getElementById('start1BTN');
const start2BTN = document.getElementById('start2BTN');
const timerBox = document.getElementById('timerBox');
const timePenalty = document.getElementById('timePenalty');

const wave1 = document.getElementById('wave1')
const compute = window.getComputedStyle(wave1);
const wave2 = document.getElementById('wave2')
const compute2 = window.getComputedStyle(wave2);
const fakeWave = document.getElementById('fakeWave');

window.playerNumber = 0;
window.gameID = null;

let waveAnimationID = null;
let timerID = null;


window.connection = new signalR.HubConnectionBuilder().withUrl("/gamehub").build();

function Connect(playerNumber) {
    window.connection.start().then(() => {
        window.connection.invoke("JoinGame", playerNumber, 1);
    });
}
window.connection.onclose(error => {
    window.connection.stop();
    cancelAnimationFrame(waveAnimationID);
    gameArea1.style.display = 'none';
    gameArea2.style.display = 'none';
    gameArea3.style.display = 'none';
    fakeWave.style.display = 'none';
    start1BTN.style.setProperty('display', 'inline-block', 'important');
    start2BTN.style.setProperty('display', 'inline-block', 'important');
    playerNumber = 0;
    // Attempt reconnection or show error to user
});

connection.on('Disconnected', function () {
    window.connection.stop();
    cancelAnimationFrame(waveAnimationID);
    gameArea1.style.display = 'none';
    gameArea2.style.display = 'none';
    gameArea3.style.display = 'none';
    fakeWave.style.display = 'none';
    start1BTN.style.setProperty('display', 'inline-block', 'important');
    start2BTN.style.setProperty('display', 'inline-block', 'important');
    playerNumber = 0;
});


connection.on("StartGame", function (gameId, gameNumber) {
    console.log("start game");
    if (playerNumber === 1) {
        gameArea1.style.display = 'block';
        fakeWave.style.display = 'block';

        enableMovement();
    } else if (playerNumber === 2) {
        gameArea1.style.display = 'block';
    }
    gameID = gameId;
    animateWaves();
    winMessage.style.display = 'none';
    restartBTN.style.display = 'none';

});

window.connection.on('SpawnWaves', function (WGD) {
    spawnWaves(WGD.xPosWave1, WGD.xPosWave2, WGD.yPosWave);
});

window.connection.on("ResponseMovement", function (xPos, yPos) {
    if (playerNumber === 1) {

    } else if (playerNumber === 2) {
        player.y = yPos;
        player.x = xPos;
    }
});

window.connection.on('Timer', function (time) {
    Timer(time);
});

window.connection.on('TimerError', function (time) {
    Timer(time);
    ShowTimePenalty();
});

window.connection.on("StartNextLevel", function (gameId, playerNumber
) {
    console.log("StartNextLevel ontvangen");
    gameOver = true;
    cancelAnimationFrame(waveAnimationID);
    nextGameBTN.style.display = 'none';
    gameArea1.style.display = 'none';
    fakeWave.style.display = 'none';
    victoryMessage.style.display = 'none';

    // Start game 2 (zorg dat game2.js geladen is en de functies bestaan)
    if (playerNumber === 1) {
        window.player1Start();
    } else if (playerNumber === 2) {
        window.player2Start();
    }
});

window.connection.on("SendLevel1Complete", function () {
    gameOver = true;
    cancelAnimationFrame(waveAnimationID);
    nextGameBTN.style.display = 'block';
});

function Timer(time) {
    let hours = Math.floor(time / 3600);
    let minutes = Math.floor((time % 3600) / 60);
    let seconds = time % 60;

    timerBox.innerText = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function ShowTimePenalty() {
    if (timerID) {
        clearTimeout(timerID);
    }
    timePenalty.style.visibility = "visible";
    timerID = setTimeout(function () {
        timePenalty.style.visibility = "hidden";
    }, 1000);
}

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
    if (playerNumber === 0) {
        start1BTN.style.display = 'none';
        start2BTN.style.display = 'none';
        Connect(1);
        playerNumber = 1;
    }
}
function startGame2() {
    console.log("playerNumber is:", playerNumber);
    if (playerNumber === 0) {
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
    function update(timestamp) {
        if (timestamp - lastTime >= interval) {
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

            if (player.y <= 10) {

                if (playerNumber === 1) {
                    console.log("sending message");
                    window.connection.invoke('Level1Complete', gameID);
                }

                return;
            }

            lastTime = timestamp;
        }
        if (!gameOver) {
            waveAnimationID = requestAnimationFrame(update);
        }
    }
    waveAnimationID = requestAnimationFrame(update);
}
function collision(a, b) {
    if (a.x + (a.width / 2) > b.x &&
        a.x < b.x + b.width && playerNumber === 1) {
        if (a.y - a.height < b.y + (b.height / 2) &&
            a.y + a.height > b.y - (b.height / 2)) {
            player.y = 360;
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ command: "alert" }));
            }
            respawnWave();
            increaseTime(gameID);
        }
    }
}
function increaseTime() {
    if (playerNumber === 1) {
        connection.invoke('IncreaseTimer', gameID).catch();
    }
}
nextGameBTN.addEventListener('click', () => {
    victoryMessage.style.display = 'none';

    if (window.connection.state === signalR.HubConnectionState.Connected) {
        window.connection.invoke('NextLevel', gameID, playerNumber)
            .catch(err => console.error('Fout bij NextLevel invoke:', err));
    } else {
        console.log('Geen verbinding met server');
    }
});
window.addEventListener('beforeunload', async () => {
    try {
        await connection.stop();  // Stops the connection
    } catch (error) {
        console.error("Error stopping SignalR connection:", error);
    }
});
// WebSocket verbinding maken met de Raspberry Pi
if (protocol != 'https:') {
    ws = new WebSocket("ws://169.254.193.164:6789");

    ws.onopen = () => {
        console.log("WebSocket verbonden met Raspberry Pi.");
        // Test het licht wanneer de verbinding tot stand komt
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("GPIO-knoppenstatus ontvangen:", data);

        if (data.button2) {
            console.log("Knop 1 is ingedrukt");
            player.x -= 2;
        }
        if (data.button1) {
            console.log("Knop 2 is ingedrukt");
            player.x += 2;
        }
        if (data.button3) {
            console.log("Knop 2 is ingedrukt");
            player.y -= 2;
        }
        if (data.button4) {
            console.log("Knop 2 is ingedrukt");
            player.y += 2;
        }
    };

    ws.onerror = (error) => {
        console.error("WebSocket-fout:", error);
    };

    ws.onclose = () => {
        console.warn("WebSocket is gesloten");
    };
}

