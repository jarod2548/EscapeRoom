let lives = 3;
const liveContainer = document.getElementById('liveContainer');

let player = {
    x: 284,
    y: 360,
    width: 32,
    height: 32
};

let enemy = {
    x: Math.floor(Math.random() * 568),
    y: 0,
    width: 32,
    height: 32
};

function startGame() {
    const gameScreen = document.getElementById('gameScreen');
    const startButton = document.getElementById('startButton');

    if (gameScreen.style.display === 'none') {
        gameScreen.style.display = 'block';
        startButton.textContent = 'Restart Game';

        enableMovement();
        movingObstacle();
    } else {
        gameScreen.style.display = 'none';
        startButton.textContent = 'Start Game';
    }
}

function enableMovement() {
    const playerElement = document.getElementById('player');
    const step = 10;

    document.addEventListener('keydown', function (event) {
        switch (event.key) {
            case "ArrowLeft":
                player.x -= step;
                break;
            case "ArrowRight":
                player.x += step;
                break;
            case "ArrowUp":
                player.y -= step;
                break;
            case "ArrowDown":
                player.y += step;
                break;
        }

        if (player.x < 0) player.x = 0;
        if (player.x > 568) player.x = 568;
        if (player.y < 0) player.y = 0;
        if (player.y > 368) player.y = 368;

        playerElement.style.left = player.x + "px";
        playerElement.style.top = player.y + "px";
    });
}

function movingObstacle() {
    const movableObstacle = document.getElementById('moveableObstacle');
    const step = 2;

    function update1() {
        enemy.y += step;

        if (enemy.y > 400) {
            enemy.y = 0;
            enemy.x = Math.floor(Math.random() * 568);
        }

        if (CheckCollision(player, enemy)) {
            enemy.y = 0;
            enemy.x = Math.floor(Math.random() * 568);

            const lastLife = liveContainer.lastElementChild;
            if (lastLife) {
                lastLife.remove();
                lives--;
            }
        }

        movableObstacle.style.left = enemy.x + "px";
        movableObstacle.style.top = enemy.y + "px";

        requestAnimationFrame(update1);
    }

    update1();
}

function CheckCollision(a, b) {
    return !(
        a.x + a.width < b.x ||
        a.x > b.x + b.width ||
        a.y + a.height < b.y ||
        a.y > b.y + b.height
    );
}

window.startGame = startGame;