ipAdresses = document.querySelectorAll(".ip-input");
ports = document.querySelectorAll(".port-label");

currentDeviceID = 0;
currentPoortID = 0;

port1 = 181;
port2 = 32;
port3 = 112;
port4 = 20;
port5 = 32;
port6 = 181;
port7 = 20;
port8 = 112;

device1 = 20;
device2 = 181;
device3 = 32;
device4 = 112;
device5 = 181;
device1 = 20;
device1 = 32;
device1 = 112;


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
        });
    });

    // Poort aanklikken
    document.querySelectorAll('.portzone').forEach(port => {
        port.addEventListener('click', () => {
            console.log("Poort aangeklikt:", port.dataset.port);

            // Highlight poort (altijd)
            document.querySelectorAll('.portzone').forEach(p => p.classList.remove('selected'));
            port.classList.add('selected');

            if (!selectedDevice) return;

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



    