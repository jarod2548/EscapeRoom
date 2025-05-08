const gameScreen = document.getElementById('gameScreen');
const player1BTN = document.getElementById('player1Button');
const player2BTN = document.getElementById('player2Button');

function player1Start()
{
    if (gameScreen.style.display === 'none')
    {
        gameScreen.style.display = 'block';
    }
}
function randomizeColors() {
    // Define an array of colors
    const colors = ['#ff6347', '#4682b4', '#32cd32', '#ffb6c1', '#ff1493', '#8a2be2'];

    // Randomly assign colors to each quadrant
    document.querySelector('.top-left').style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    document.querySelector('.top-right').style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    document.querySelector('.bottom-left').style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    document.querySelector('.bottom-right').style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
}