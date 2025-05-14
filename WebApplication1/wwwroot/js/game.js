let lives = 3;
let player = { x: 284, y: 360, width: 32, height: 32 };
const playerElement = document.getElementById('player');
const fakePlayer = document.getElementById('fakePlayer');
const waveContainer1 = document.getElementById('gameArea1');
const waveContainer2 = document.getElementById('gameArea2');
const winMessage = document.getElementById('winMessage');
const restartBTN = document.getElementById('restartBtn');

let gameID = null;
let playerNumber = null;

let waves = [];
const waveCount = 5;
const connection = new signalR.HubConnectionBuilder().withUrl("/gamehub").build();

function Connect(playerNumber) {
    connection.start().then(() => {
        connection.invoke("JoinGame", playerNumber, 1);
    });
}

connection.on("StartGame", function (gameId, gameNumber) {
    if (gameNumber === 1) {   
        waveContainer1.style.display = 'block';
        enableMovement();
    } else if (gameNumber === 2) {
        waveContainer2.style.display = 'block';
    }
    gameID = gameId;
    document.getElementById('gameOverMessage').style.display = 'none';
    winMessage.style.display = 'none'; // Hide win message
    restartBTN.style.display = 'none';  // Hide restart button initially
    createWaves();
    animateWaves();
    
});

connection.on("ResponseMovement", function (xPos, yPos) {
    if (playerNumber === 1) {

    } else if (playerNumber === 2) {
        fakePlayer.style.left = xPos + "px";
        playerElement.style.top = yPos + "px";
    }
});


function SendMovement(xPos, yPos) {
    connection.invoke("SendMovement", xPos, yPos, gameID);
}

function createWaves() {
    waves.forEach(w => w.el.remove());
    waves = [];

    for (let i = 0; i < waveCount; i++) {
        let wave = document.createElement('div');
        wave.classList.add('wave');
        wave.style.left = Math.random() * 568 + 'px';
        wave.style.top = Math.random() * -200 + 'px';
        waveContainer1.appendChild(wave);
        waves.push({
            el: wave,
            x: Math.random() * 568,
            y: Math.random() * -200,
            speed: Math.random() * 2 + 1
        });
    }
}

function startGame1() {

    if (playerNumber === null) {
        Connect(1);
        playerNumber = 1;
    }    
}
function startGame2() {

    if (playerNumber === null) {
        Connect(2);
        playerNumber = 2;
    }  
}

function enableMovement() {
    document.onkeydown = function (event) {
        const step = 10;
        switch (event.key.toLowerCase()) {
            case 'a': player.x -= step;
                SendMovement(player.x, player.y);
                break;
            case 'd': player.x += step;
                SendMovement(player.x, player.y);                break;
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

function animateWaves() {
    function update() {
        let gameOver = false;

        waves.forEach(wave => {
            wave.y += wave.speed;
            if (wave.y > 400) {
                wave.y = 0;
                wave.x = Math.random() * 568;
            }

            wave.el.style.left = wave.x + "px";
            wave.el.style.top = wave.y + "px";

            if (checkCollision(player, wave)) {
                wave.y = 0;
                wave.x = Math.random() * 568;
                const heart = document.querySelector('#liveContainer .life:last-child');
                if (heart) heart.remove();
                lives--;
            }
        });

        if (lives <= 0) {
            gameOver = true;
        }

        // Check for win condition (if the player reaches the top of the screen)
        if (player.y <= 0) {
            winMessage.style.display = 'block'; // Show win message
            restartBTN.style.display = 'inline';  // Show restart button after winning
            document.onkeydown = null; // Disable movement when player wins
            return; // Stop the game
        }

        if (gameOver) {
            gameOverLogic();
        } else {
            requestAnimationFrame(update);
        }
    }

    update();
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
    document.getElementById('restartBtn').style.display = 'inline';  // Show restart button
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
    document.getElementById('winMessage').style.display = 'none'; // Hide win message
    document.getElementById('restartBtn').style.display = 'none';  // Hide restart button

    createWaves();
    animateWaves();
    enableMovement();
}
