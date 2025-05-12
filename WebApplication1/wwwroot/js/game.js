
let lives = 3;
let player = { x: 284, y: 360, width: 32, height: 32 };
const playerElement = document.getElementById('player');
const wave1 = document.getElementById('wave1');
const wave2 = document.getElementById('wave2');
const waves = [
    { el: wave1, x: Math.random() * 568, y: 0 },
    { el: wave2, x: Math.random() * 568, y: -200 }
];

function startGame() {
    enableMovement();
    animateWaves();
}

function enableMovement() {
    document.addEventListener('keydown', function (event) {
        const step = 10;
        switch (event.key.toLowerCase()) {
            case 'a': player.x -= step; break;
            case 'd': player.x += step; break;
            case 'w': player.y -= step; break;
            case 's': player.y += step; break;
        }
        player.x = Math.max(0, Math.min(player.x, 568));
        player.y = Math.max(0, Math.min(player.y, 368));
        playerElement.style.left = player.x + "px";
        playerElement.style.top = player.y + "px";
    });
}

function animateWaves() {
    const speed = 2;
    function update() {
        waves.forEach(wave => {
            wave.y += speed;
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
            }
        });
        requestAnimationFrame(update);
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

window.startGame = startGame;

