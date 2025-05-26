
const userCode1 = document.getElementById("codeInput1");
const feedback = document.getElementById("feedback");


function checkCode() {
    let awnser;
    try {
        let [a, b] = userCode1.value.split(',').map(num => parseFloat(num.trim()));
        awnser = Add(a, b);
        feedback.innerHTML = `anwser = ${awnser} `;
    }
    catch {

    }
}
function Add(a, b) {
    let result = a + b;
    return result;
}