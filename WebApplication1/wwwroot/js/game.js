// Function to start the game by showing the game screen and enabling movement

let lives = 5;

let player =
{
    x: 50,
    y:50,
    width: 12,
    height: 12,
};
let enemy =
{
    x: 50,
    y: 50,
    width: 12,
        height: 12,
};
function startGame() {
    const gameScreen = document.getElementById('gameScreen');
    const startButton = document.getElementById('startButton');

    // Show the game screen and start the game
    if (gameScreen.style.display === 'none') {
        gameScreen.style.display = 'block';
        startButton.textContent = 'Restart Game';

        enableMovement();
        movingObstacle();// Enable movement when game starts
    } else {
        gameScreen.style.display = 'none';
        startButton.textContent = 'Start Game';
    }
}
function CheckCollisision(obj1, obj2)
{
    return !(obj1.x + obj1.width < obj2.x ||
        obj1.x > obj2.x + obj2.width ||
        obj1.y + obj1.height < obj2.y ||
        obj1.y > obj2.y + obj2.height);
}

function Update()
{
    requestAnimationFrame(Update);
}
requestAnimationFrame(Update);

function movingObstacle()
{
    const movableObstacle = document.getElementById('moveableObstacle');

    let velocity = { x: 0, y: 0 };
    const step = 2;
    function moveObstacle() {
        movableObstacle.style.left = enemy.x + '%';
        movableObstacle.style.top = enemy.y + '%';
    }

    function update1() {
        // Update position based on velocity
       enemy.x += velocity.x;
        enemy.y += step;

        // Prevent object from going outside the boundaries
        if (enemy.x < 0) enemy.x = 0;
        if (enemy.x > 95)
            enemy.x = 95;
        if (enemy.y < 0) enemy.y = 0;
        if (enemy.y > 95)
        {
            enemy.y = 0;
            enemy.x = Math.random() * 95;
        } 

        if (CheckCollisision(enemy, player)) {
            enemy.y = 0;
            enemy.x = Math.random() * 95;
        }

        moveObstacle(); // Update the object's position on the screen

        requestAnimationFrame(update1); // Call update again for the next frame
    }
    requestAnimationFrame(update1);
}

// Function to enable movement of the object
function enableMovement() {
    const movableObject = document.getElementById('movableObject');

    // Velocity (how fast the object moves per frame)
    let velocity = { x: 0, y: 0 };
    const step = 2;  // Small step to increase frame rate responsiveness

    // Function to update the object's position
    function moveObject() {
        movableObject.style.left = player.x + '%';
        movableObject.style.top = player.y + '%';

    }

    

    // Function to update game logic (key detection and movement)
    function update() {
        // Update position based on velocity
        player.x += velocity.x;
        player.y += velocity.y;

        // Prevent object from going outside the boundaries
        if (player.x < 0) player.x = 0;
        if (player.x > 95) player.x = 95;
        if (player.y < 0) player.y = 0;
        if (player.y > 95) player.y = 95;

        if (CheckCollisision(player, enemy)) {
            lives -= 1;
        }

        moveObject(); // Update the object's position on the screen

        requestAnimationFrame(update); // Call update again for the next frame
    }

    // Start the update loop using requestAnimationFrame
    requestAnimationFrame(update);

    // Listen for keydown events
    document.addEventListener('keydown', function (event) {
        // Prevent default browser behavior (e.g., scrolling) for arrow keys
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
            event.preventDefault();  // Prevent page scrolling and other browser default actions
        }

        // Adjust velocity based on the key pressed
        switch (event.key) {
            case 'ArrowLeft':
                velocity.x = -step; // Move left
                break;
            case 'ArrowRight':
                velocity.x = step; // Move right
                break;
            case 'ArrowUp':
                velocity.y = -step; // Move up
                break;
            case 'ArrowDown':
                velocity.y = step; // Move down
                break;
            default:
                return; // Ignore other keys
        }
    });

    // Listen for keyup events to stop movement
    document.addEventListener('keyup', function (event) {
        // Stop movement when the key is released
        if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
            velocity.x = 0;
        }
        if (['ArrowUp', 'ArrowDown'].includes(event.key)) {
            velocity.y = 0;
        }
    });
}