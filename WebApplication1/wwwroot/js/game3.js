
window.levelCompleteBlock = document.getElementById("levelCompleteBlock");
window.levelCompleteTime = document.getElementById("levelCompleteTime");

const questions = [
    document.getElementById('question1'),
    document.getElementById('question2'),
    document.getElementById('question3')
]



let questionInt = 0;

window.connection.on("SendLevel2Complete", function () {
    window.gameArea2.style.display = "none";
    window.gameArea3.style.display = "none";
    if (window.playerNumber === 1) {
        window.gameArea4.style.display = "grid";
    } else {
        window.gameArea5.style.display = "grid";
    }
});

function goToPreviousQuestion() {
    console.log("hello");
    questions[questionInt].style.display = "none";
    
    questionInt--;
    if (questionInt < 0) {
        questionInt = 2;
    }
    questions[questionInt].style.display = "block";
}
function goToNextQuestion() {
    questions[questionInt].style.display = "none";
    questionInt++;
    if (questionInt > 2) {
        questionInt = 0;
    }
    questions[questionInt].style.display = "block";
}

function checkAwnsers() {
    window.connection.invoke("Level3Complete", window.gameID);
}

window.connection.on("GameComplete", function (time) {
    window.levelCompleteBlock.style.display = "flow";
    showTimeComplete(time);
});

function showTimeComplete(time) {
    let hours = Math.floor(time / 3600);
    let minutes = Math.floor((time % 3600) / 60);
    let seconds = time % 60;

    window.levelCompleteTime.innerText = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}