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

const device1 = 20;
const device2 = 181;
const device3 = 32;
const device4 = 112;
const device5 = 181;
const device1 = 20;
const device1 = 32;
const device1 = 112;

const drawnLines = new Set();


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

            const lineKey;

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

            line.addEventListener('click', (e) => {
                e.target.remove();
            });

            svg.appendChild(line);

            selectedDevice.classList.remove('selected');
            selectedDevice = null;
        });
    });
}



    