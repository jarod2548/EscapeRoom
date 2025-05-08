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