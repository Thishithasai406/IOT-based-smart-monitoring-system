document.addEventListener('DOMContentLoaded', () => {
    const moistureEl = document.getElementById('moisture');
    const temperatureEl = document.getElementById('temperature');
    const phEl = document.getElementById('ph');
    const weatherEl = document.getElementById('weather');
    const alertBox = document.getElementById('alert');
  
    function fetchSensorData() {
        fetch('/sensor-data')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Received data:', data);
                if (!data || typeof data !== 'object' || !data.moisture || !data.temperature || !data.ph || !data.weather || !data.timestamp) {
                    throw new Error('Incomplete data received');
                }
  
                moistureEl.textContent = `${data.moisture}%`;
                temperatureEl.textContent = `${data.temperature} °C`;
                phEl.textContent = `${data.ph}`;
                weatherEl.textContent = data.weather;
  
                // Trigger water pump alerts based on moisture level
                if (data.moisture < 30) {
                    alertBox.textContent = "Soil too dry. Auto-watering triggered!";
                    alertBox.classList.add('alert-dry');
                    alertBox.classList.remove('alert-normal', 'alert-wet');
                    // Optionally send command to backend to activate pump
                    fetch('/activate-pump', { method: 'POST' });
                } else if (data.moisture > 55) {
                    alertBox.textContent = "Soil too moist. Consider pausing irrigation.";
                    alertBox.classList.add('alert-wet');
                    alertBox.classList.remove('alert-normal', 'alert-dry');
                    // Optionally send command to backend to deactivate pump
                    fetch('/deactivate-pump', { method: 'POST' });
                } else {
                    alertBox.textContent = "Soil moisture is optimal.";
                    alertBox.classList.add('alert-normal');
                    alertBox.classList.remove('alert-dry', 'alert-wet');
                }
  
                moistureHistory.push({ timestamp: data.timestamp, moisture: data.moisture });
                temperatureHistory.push({ timestamp: data.timestamp, temperature: data.temperature });
                phHistory.push({ timestamp: data.timestamp, ph: data.ph });
  
                if (moistureHistory.length > 10) moistureHistory.shift();
                if (temperatureHistory.length > 10) temperatureHistory.shift();
                if (phHistory.length > 10) phHistory.shift();
  
                updateMoistureGraph();
                updateTemperatureGraph();
                updatePhGraph();
            })
            .catch(err => {
                console.error("Error fetching sensor data:", err);
                alertBox.textContent = `Failed to fetch sensor data: ${err.message}`;
                moistureEl.textContent = '--%';
                temperatureEl.textContent = '-- °C';
                phEl.textContent = '--';
                weatherEl.textContent = '--';
            });
    }
  
    let moistureHistory = [];
    let temperatureHistory = [];
    let phHistory = [];
  
    function updateMoistureGraph() {
        const timestamps = moistureHistory.map(entry => entry.timestamp);
        const values = moistureHistory.map(entry => entry.moisture);
  
        const trace = {
            x: timestamps,
            y: values,
            mode: 'lines+markers',
            type: 'scatter',
            name: 'Moisture (%)',
            line: { color: '#28a745' }
        };
  
        const layout = {
            margin: { t: 30 },
            xaxis: { title: 'Time' },
            yaxis: { title: 'Moisture (%)', range: [0, 100] }
        };
  
        Plotly.newPlot('moistureGraph', [trace], layout);
    }
  
    function updateTemperatureGraph() {
        const timestamps = temperatureHistory.map(entry => entry.timestamp);
        const values = temperatureHistory.map(entry => entry.temperature);
  
        const trace = {
            x: timestamps,
            y: values,
            mode: 'lines+markers',
            type: 'scatter',
            name: 'Temperature (°C)',
            line: { color: '#ff6347' }
        };
  
        const layout = {
            margin: { t: 30 },
            xaxis: { title: 'Time' },
            yaxis: { title: 'Temperature (°C)', range: [10, 45] }
        };
  
        Plotly.newPlot('temperatureGraph', [trace], layout);
    }
  
    function updatePhGraph() {
        const timestamps = phHistory.map(entry => entry.timestamp);
        const values = phHistory.map(entry => entry.ph);
  
        const trace = {
            x: timestamps,
            y: values,
            mode: 'lines+markers',
            type: 'scatter',
            name: 'pH',
            line: { color: '#007bff' }
        };
  
        const layout = {
            margin: { t: 30 },
            xaxis: { title: 'Time' },
            yaxis: { title: 'pH', range: [4, 9] }
        };
  
        Plotly.newPlot('phGraph', [trace], layout);
    }
  
    // Fetch initial data and set interval
    fetchSensorData();
    setInterval(fetchSensorData, 5000);
  
    // Toggle dark/light mode with debugging
    const toggleBtn = document.getElementById('toggle-mode');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
        });
    }
});
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

    // Close the modal when the user clicks on <span> (x)
    closeBtn.onclick = function() {
        modal.style.display = "none";
    }

    // Close the modal when the user clicks on OK button
    okButton.onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    function fetchSensorData() {
        fetch('/sensor-data')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Received data:', data);
                if (!data || typeof data !== 'object' || !data.moisture || !data.temperature || !data.ph || !data.weather || !data.timestamp) {
                    throw new Error('Incomplete data received');
                }

                moistureEl.textContent = `${data.moisture}%`;
                temperatureEl.textContent = `${data.temperature} °C`;
                phEl.textContent = `${data.ph}`;
                weatherEl.textContent = data.weather;

                // Handle soil moisture and trigger pump actions
                if (data.moisture < 30) {
                    // Soil is too dry, switch pump ON
                    modalMessage.textContent = "Switching ON the pump";
                    modal.style.display = "block"; // Show modal
                    fetch('/activate-pump', { method: 'POST' })
                        .then(response => response.json())
                        .then(data => console.log(data))
                        .catch(err => console.error('Error activating pump:', err));
                } else if (data.moisture > 55) {
                    // Soil is too moist, switch pump OFF
                    modalMessage.textContent = "Switching OFF the pump";
                    modal.style.display = "block"; // Show modal
                    fetch('/deactivate-pump', { method: 'POST' })
                        .then(response => response.json())
                        .then(data => console.log(data))
                        .catch(err => console.error('Error deactivating pump:', err));
                }

                // If moisture is optimal, don't trigger any pump action
                else {
                    // Optionally, you could show an alert or message here if needed
                }

                moistureHistory.push({ timestamp: data.timestamp, moisture: data.moisture });
                temperatureHistory.push({ timestamp: data.timestamp, temperature: data.temperature });
                phHistory.push({ timestamp: data.timestamp, ph: data.ph });

                if (moistureHistory.length > 10) moistureHistory.shift();
                if (temperatureHistory.length > 10) temperatureHistory.shift();
                if (phHistory.length > 10) phHistory.shift();

                updateMoistureGraph();
                updateTemperatureGraph();
                updatePhGraph();
            })
            .catch(err => {
                console.error("Error fetching sensor data:", err);
                alertBox.textContent = `Failed to fetch sensor data: ${err.message}`;
                moistureEl.textContent = '--%';
                temperatureEl.textContent = '-- °C';
                phEl.textContent = '--';
                weatherEl.textContent = '--';
            });
    }

    let moistureHistory = [];
    let temperatureHistory = [];
    let phHistory = [];

    function updateMoistureGraph() {
        const timestamps = moistureHistory.map(entry => entry.timestamp);
        const values = moistureHistory.map(entry => entry.moisture);

        const trace = {
            x: timestamps,
            y: values,
            mode: 'lines+markers',
            type: 'scatter',
            name: 'Moisture (%)',
            line: { color: '#28a745' }
        };

        const layout = {
            margin: { t: 30 },
            xaxis: { title: 'Time' },
            yaxis: { title: 'Moisture (%)', range: [0, 100] }
        };

        Plotly.newPlot('moistureGraph', [trace], layout);
    }

    function updateTemperatureGraph() {
        const timestamps = temperatureHistory.map(entry => entry.timestamp);
        const values = temperatureHistory.map(entry => entry.temperature);

        const trace = {
            x: timestamps,
            y: values,
            mode: 'lines+markers',
            type: 'scatter',
            name: 'Temperature (°C)',
            line: { color: '#ff6347' }
        };

        const layout = {
            margin: { t: 30 },
            xaxis: { title: 'Time' },
            yaxis: { title: 'Temperature (°C)', range: [10, 45] }
        };

        Plotly.newPlot('temperatureGraph', [trace], layout);
    }

    function updatePhGraph() {
        const timestamps = phHistory.map(entry => entry.timestamp);
        const values = phHistory.map(entry => entry.ph);

        const trace = {
            x: timestamps,
            y: values,
            mode: 'lines+markers',
            type: 'scatter',
            name: 'pH',
            line: { color: '#007bff' }
        };

        const layout = {
            margin: { t: 30 },
            xaxis: { title: 'Time' },
            yaxis: { title: 'pH', range: [4, 9] }
        };

        Plotly.newPlot('phGraph', [trace], layout);
    }

    // Fetch initial data and set interval
    fetchSensorData();
    setInterval(fetchSensorData, 5000);
});
