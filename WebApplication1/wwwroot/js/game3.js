
const question1 = document.getElementById('question1');
const question2 = document.getElementById('question2');
const question3 = document.getElementById('question3');

window.connection.on("SendLevel2Complete", function () {
    window.gameArea2.style.display = "none";
    window.gameArea3.style.display = "none";
    if (window.playerNumber === 1) {
        window.gameArea4.style.display = "block";
    } else {
        window.gameArea5.style.display = "block";
    }
});

function goToPreviousQuestion() {

}
function goToNextQuestion() {

}