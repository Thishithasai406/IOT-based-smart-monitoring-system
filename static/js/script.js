document.addEventListener('DOMContentLoaded', () => {
    const moistureEl = document.getElementById('moisture');
    const temperatureEl = document.getElementById('temperature');
    const phEl = document.getElementById('ph');
    const weatherEl = document.getElementById('weather');
    const alertBox = document.getElementById('alert');
    const modal = document.getElementById('pumpStatusModal');
    const modalMessage = document.getElementById('pumpStatusMessage');
    const closeBtn = document.querySelector('.close-btn');
    const okButton = document.getElementById('okButton');

    let moistureHistory = [];
    let temperatureHistory = [];
    let phHistory = [];

    // Close modal logic
    closeBtn.onclick = () => modal.style.display = "none";
    okButton.onclick = () => modal.style.display = "none";
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };

    // Fetch sensor data and update UI
    function fetchSensorData() {
        fetch('/sensor-data')
            .then(response => {
                if (!response.ok) throw new Error(`Network error: ${response.statusText}`);
                return response.json();
            })
            .then(data => {
                if (!data || typeof data !== 'object' || 
                    data.moisture === undefined || 
                    data.temperature === undefined || 
                    data.ph === undefined || 
                    !data.timestamp) {
                    throw new Error('Incomplete sensor data');
                }

                // Update text values
                moistureEl.textContent = `${data.moisture}%`;
                temperatureEl.textContent = `${data.temperature} °C`;
                phEl.textContent = data.ph;
                weatherEl.textContent = data.weather || '--';

                // Handle moisture alerts and pump control
                if (data.moisture < 30) {
                    alertBox.textContent = "Soil too dry. Auto-watering triggered!";
                    alertBox.className = 'alert alert-dry';
                    modalMessage.textContent = "Switching ON the pump";
                    modal.style.display = "block";
                } else if (data.moisture > 70) {
                    alertBox.textContent = "Soil too moist. Consider pausing irrigation.";
                    alertBox.className = 'alert alert-wet';
                    modalMessage.textContent = "Switching OFF the pump";
                    modal.style.display = "block";
                } else {
                    alertBox.textContent = "Soil moisture is optimal.";
                    alertBox.className = 'alert alert-normal';
                    modal.style.display = "none";
                }

                // Update history arrays
                moistureHistory.push({ timestamp: data.timestamp, moisture: data.moisture });
                temperatureHistory.push({ timestamp: data.timestamp, temperature: data.temperature });
                phHistory.push({ timestamp: data.timestamp, ph: data.ph });

                if (moistureHistory.length > 10) moistureHistory.shift();
                if (temperatureHistory.length > 10) temperatureHistory.shift();
                if (phHistory.length > 10) phHistory.shift();

                // Update charts
                updateMoistureGraph();
                updateTemperatureGraph();
                updatePhGraph();
            })
            .catch(err => {
                console.error("Error:", err);
                alertBox.textContent = `Error: ${err.message}`;
                alertBox.className = 'alert alert-error';
                moistureEl.textContent = '--%';
                temperatureEl.textContent = '-- °C';
                phEl.textContent = '--';
                weatherEl.textContent = '--';
            });
    }

    // Graph rendering
    function updateMoistureGraph() {
        const trace = {
            x: moistureHistory.map(e => e.timestamp),
            y: moistureHistory.map(e => e.moisture),
            mode: 'lines+markers',
            type: 'scatter',
            name: 'Moisture (%)',
            line: { color: '#28a745' }
        };
        Plotly.newPlot('moistureGraph', [trace], {
            margin: { t: 30 },
            xaxis: { title: 'Time' },
            yaxis: { title: 'Moisture (%)', range: [0, 100] }
        });
    }

    function updateTemperatureGraph() {
        const trace = {
            x: temperatureHistory.map(e => e.timestamp),
            y: temperatureHistory.map(e => e.temperature),
            mode: 'lines+markers',
            type: 'scatter',
            name: 'Temperature (°C)',
            line: { color: '#ff6347' }
        };
        Plotly.newPlot('temperatureGraph', [trace], {
            margin: { t: 30 },
            xaxis: { title: 'Time' },
            yaxis: { title: 'Temperature (°C)', range: [10, 45] }
        });
    }

    function updatePhGraph() {
        const trace = {
            x: phHistory.map(e => e.timestamp),
            y: phHistory.map(e => e.ph),
            mode: 'lines+markers',
            type: 'scatter',
            name: 'pH',
            line: { color: '#007bff' }
        };
        Plotly.newPlot('phGraph', [trace], {
            margin: { t: 30 },
            xaxis: { title: 'Time' },
            yaxis: { title: 'pH', range: [4, 9] }
        });
    }

    // Fetch first data point immediately and then poll every 5 seconds
    fetchSensorData();
    setInterval(fetchSensorData, 5000);

    // Toggle light/dark mode
    const toggleBtn = document.getElementById('toggle-mode');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
        });
    }
});
