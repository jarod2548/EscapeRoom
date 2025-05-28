const ipAdresses = document.querySelectorAll(".ip-input");
const ports = document.querySelectorAll(".port-label");

let currentDeviceID = 0;
let currentPoortID = 0;

const port1 = 181;
const port2 = 32;
const port3 = 112;
const port4 = 20;
const port5 = 32;
const port6 = 181;
const port7 = 20;
const port8 = 112;

const computer1 = 20;
const computer2 = 181;
const computer3 = 32;
const computer4 = 112;
const laptop1 = 181;
const laptop2 = 20;
const laptop3 = 32;
const laptop4 = 112;

const activeDevices = new Set();
const activePorts = new Set();


if (window.connection) {
    window.connection.on("StartGame4", function () {
        window.gameArea4.style.display = "none";
        window.gameArea5.style.display = "none";
        window.gameArea6.style.display = "block";
        if (window.playerNumber === 1) {           
            ports.forEach(function (port) {
                port.style.display = "none";
                allowClicks();
            });
        } else {
            ipAdresses.forEach(function (adress) {
                adress.style.display = "none";
            });
        }
    });
}

function isValidConnection(deviceID, portID) {

    portID = parseInt(portID);

    let portValue;
    switch (portID) {
        case 1: portValue = port1; break;
        case 2: portValue = port2; break;
        case 3: portValue = port3; break;
        case 4: portValue = port4; break;
        case 5: portValue = port5; break;
        case 6: portValue = port6; break;
        case 7: portValue = port7; break;
        case 8: portValue = port8; break;
        default: return false;
    }
    switch (deviceID) {
        case "laptop1":
            return laptop1 === portValue;
        case "laptop2":
            return laptop2 === portValue;
        case "laptop3":
            return laptop3 === portValue;
        case "laptop4":
            return laptop4 === portValue;
        case "computer1":
            return computer1 === portValue;
        case "computer2":
            return computer2 === portValue;
        case "computer3":
            return computer3 === portValue;
        case "computer4":
            return computer4 === portValue;
        default:
            return false;
    }
};

function CheckIfCorrect() {
    let num = 0;
    const allLines = document.querySelectorAll(".connection-line");
    allLines.forEach((line) => {
        const deviceID = line.getAttribute('data-device-id');
        const portID = line.getAttribute('data-port-id');
        let wip = isValidConnection(deviceID, portID);
        if (wip) {
            num++;
        }
        if (num === 8) {
            window.connection.invoke("Level4Complete", window.gameID);
        }
    });
}

function allowClicks() {
    let selectedDevice = null;

    // Apparaat aanklikken
    document.querySelectorAll('.device').forEach(device => {
        device.addEventListener('click', () => {
            document.querySelectorAll('.device').forEach(d => d.classList.remove('selected'));
            document.querySelectorAll('.portzone').forEach(p => p.classList.remove('selected'));

            selectedDevice = device;
            device.classList.add('selected');

            console.log("Apparaat geselecteerd:", device.id);
            currentDeviceID = device.id;
        });
    });

    // Poort aanklikken
    document.querySelectorAll('.portzone').forEach(port => {
        port.addEventListener('click', () => {
            console.log("Poort aangeklikt:", port.dataset.port);
            currentPoortID = port.dataset.port;

            // Highlight poort (altijd)
            document.querySelectorAll('.portzone').forEach(p => p.classList.remove('selected'));
            port.classList.add('selected');

            if (!selectedDevice) return;

            if (activeDevices.has(selectedDevice.id) || activePorts.has(port.dataset.port)) {
                console.log("This device or port is already part of an active connection.");
                return; // Exit, no new line created
            }

            const deviceRect = selectedDevice.getBoundingClientRect();
            const portRect = port.getBoundingClientRect();
            const svg = document.getElementById('SVGlines');
            const svgRect = svg.getBoundingClientRect();

            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.classList.add("connection-line");
            line.setAttribute("x1", deviceRect.left + deviceRect.width / 2 - svgRect.left);
            line.setAttribute("y1", deviceRect.top + deviceRect.height / 2 - svgRect.top);
            line.setAttribute("x2", portRect.left + portRect.width / 2 - svgRect.left);
            line.setAttribute("y2", portRect.top + portRect.height / 2 - svgRect.top);
            line.setAttribute("stroke", "lime");
            line.setAttribute("stroke-width", "2");
            line.setAttribute("data-device-id", selectedDevice.id);
            line.setAttribute("data-port-id", port.dataset.port); 

            line.addEventListener('click', (e) => {

                const deviceID = e.target.getAttribute('data-device-id');
                const portID = e.target.getAttribute('data-port-id');
                e.target.remove();

                activeDevices.delete(deviceID);
                activePorts.delete(portID);
            });

            svg.appendChild(line);

            activeDevices.add(selectedDevice.id);
            activePorts.add(port.dataset.port);

            selectedDevice.classList.remove('selected');
            selectedDevice = null;

            CheckIfCorrect();
        });
    });
}



    