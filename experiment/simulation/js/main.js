// Enhanced Data and Functions
const sampleData = [
    {"CO₂ (%)": 5, "Flow (kg/s)": 5},
    {"CO₂ (%)": 10, "Flow (kg/s)": 10},
    {"CO₂ (%)": 15, "Flow (kg/s)": 15},
    {"CO₂ (%)": 20, "Flow (kg/s)": 20},
    {"CO₂ (%)": 25, "Flow (kg/s)": 25},
    {"CO₂ (%)": 30, "Flow (kg/s)": 30},
    {"CO₂ (%)": 35, "Flow (kg/s)": 35},
    {"CO₂ (%)": 40, "Flow (kg/s)": 40},
    {"CO₂ (%)": 45, "Flow (kg/s)": 45},
    {"CO₂ (%)": 50, "Flow (kg/s)": 50},
];

// Technology efficiency functions
function solventAbsorption(co2Input, temp, pressure) {
    const baseEfficiency = 0.85;
    const tempEffect = 1 - Math.min(0.5, Math.abs(temp - 40) / 100);
    const pressureEffect = Math.min(1, pressure / 100 * 1.5);

    return co2Input * baseEfficiency * tempEffect * pressureEffect;
}

function membraneSeparation(co2Input, temp, pressure) {
    const baseEfficiency = 0.75;
    const tempEffect = 1 - Math.min(0.4, Math.abs(temp - 100) / 200);
    const pressureEffect = Math.min(1, pressure / 100 * 1.2);
    return co2Input * baseEfficiency * tempEffect * pressureEffect;
}

function mineralization(co2Input, temp) {
    const baseEfficiency = 0.6;
    const tempEffect = temp > 100 ? 1 : 0.8;
    return co2Input * baseEfficiency * tempEffect;
}

function cryogenicSeparation(co2Input, temp) {
    const baseEfficiency = 0.9;
    const tempEffect = temp < -50 ? 1 : 0.7;
    return co2Input * baseEfficiency * tempEffect;
}

function adsorption(co2Input, pressure) {
    const baseEfficiency = 0.8;
    const pressureEffect = Math.min(1, pressure / 100 * 1.3);
    return co2Input * baseEfficiency * pressureEffect;
}

function bioSequestration(co2Input, temp) {
    const baseEfficiency = 0.5;
    const tempEffect = (temp > 10 && temp < 40) ? 1 : 0.6;
    return co2Input * baseEfficiency * tempEffect;
}

// Energy and cost calculation functions
function calculateEnergy(tech, capturedAmount, temp, pressure) {
    const baseEnergy = {
        "Solvent Absorption": 0.8, // kWh/kg
        "Membrane Separation": 0.5,
        "Mineralization": 1.2,
        "Cryogenic": 1.5,
        "Adsorption": 0.6,
        "Bio-sequestration": 0.3
    }[tech];

    const tempFactor = 1 + Math.abs(temp - 25) / 200;
    const pressureFactor = 1 + pressure / 50;

    return baseEnergy * tempFactor * pressureFactor;
}

function calculateCost(tech, storage, capturedAmount, energy) {
    const techCost = {
        "Solvent Absorption": 40, // $/ton
        "Membrane Separation": 60,
        "Mineralization": 80,
        "Cryogenic": 100,
        "Adsorption": 50,
        "Bio-sequestration": 30
    }[tech];

    const storageCost = {
        "Geological": 10,
        "Ocean": 5,
        "Mineral": 15,
        "Industrial": -20 // Negative cost indicates potential revenue from use
    }[storage];

    const energyCost = energy * 0.10 * 1000;

    return techCost + storageCost + energyCost;
}

// DOM Elements
const captureTypeSelect = document.getElementById('captureType');
const techRouteSelect = document.getElementById('techRoute');
const storageMethodSelect = document.getElementById('storageMethod');
const temperatureSlider = document.getElementById('temperature');
const pressureSlider = document.getElementById('pressure');
const tempValueDisplay = document.getElementById('tempValue');
const pressureValueDisplay = document.getElementById('pressureValue');
const runSimulationButton = document.getElementById('runSimulation');
const resultsTableBody = document.querySelector('#resultsTable tbody');
const threeJsCanvas = document.getElementById('threeJsCanvas');
const threeJsInfo = document.getElementById('threeJsInfo');

// Chart canvas elements
const efficiencyChartCanvas = document.getElementById('efficiencyChart');
const costChartCanvas = document.getElementById('costChart');

// Three.js Setup
let scene, camera, renderer;
let capturedParticles = [], remainingParticles = [];
let efficiencyChart, costChart;
let lastTimestamp = 0;
let frameCount = 0;
let fps = 0;
let simulationHistory = [];

function initThreeJS() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    camera = new THREE.PerspectiveCamera(60, threeJsCanvas.clientWidth / threeJsCanvas.clientHeight, 0.1, 1000);
    camera.position.set(0, 5, 20);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({
        canvas: threeJsCanvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(threeJsCanvas.clientWidth, threeJsCanvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight1.position.set(5, 10, 7);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight2.position.set(-5, -10, -7);
    scene.add(directionalLight2);

    const planeGeometry = new THREE.PlaneGeometry(50, 50);
    const planeMaterial = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        side: THREE.DoubleSide
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -10;
    scene.add(plane);

    createStorageVisualization();
    updateThreeJSVisualization(0, 100, 0, 0);

    animate();
}

window.addEventListener('resize', () => {
    if (camera && renderer) {
        camera.aspect = threeJsCanvas.clientWidth / threeJsCanvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(threeJsCanvas.clientWidth, threeJsCanvas.clientHeight);
    }
});

function createStorageVisualization() {
    scene.children.forEach(obj => {
        if (obj.name === 'storageViz') {
            scene.remove(obj);
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) obj.material.dispose();
        }
    });

    const storageMethod = storageMethodSelect.value;
    let storageVisualization;

    if (storageMethod === "Geological") {
        const rockGeometry = new THREE.BoxGeometry(15, 5, 15);
        const rockMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B4513,
            roughness: 0.8,
            metalness: 0.1
        });
        storageVisualization = new THREE.Mesh(rockGeometry, rockMaterial);
        storageVisualization.position.set(0, -12, 0);
        storageVisualization.name = 'storageViz';
        scene.add(storageVisualization);

        for (let i = 0; i < 3; i++) {
            const layerGeometry = new THREE.BoxGeometry(15 - i*2, 0.5, 15 - i*2);
            const layerMaterial = new THREE.MeshStandardMaterial({
                color: new THREE.Color(0x654321).lerp(new THREE.Color(0x8B4513), i/3),
                roughness: 0.7,
                metalness: 0.1
            });
            const layer = new THREE.Mesh(layerGeometry, layerMaterial);
            layer.position.set(0, -9 + i*0.5, 0);
            layer.name = 'storageViz';
            scene.add(layer);
        }
        threeJsInfo.innerHTML = `
            <p>Visualizing <strong>Geological Storage</strong>. CO₂ is injected into deep underground rock formations, often saline aquifers or depleted oil/gas reservoirs.</p>
        `;
    } else if (storageMethod === "Ocean") {
        const waterGeometry = new THREE.PlaneGeometry(30, 30, 10, 10);
        const waterMaterial = new THREE.MeshStandardMaterial({
            color: 0x1E90FF,
            transparent: true,
            opacity: 0.7,
            roughness: 0.2,
            metalness: 0.5
        });
        storageVisualization = new THREE.Mesh(waterGeometry, waterMaterial);
        storageVisualization.rotation.x = -Math.PI / 2;
        storageVisualization.position.set(0, -5, 0);
        storageVisualization.name = 'storageViz';
        scene.add(storageVisualization);

        const waveGeometry = new THREE.PlaneGeometry(30, 30, 50, 50);
        const waveMaterial = new THREE.MeshStandardMaterial({
            color: 0x1E90FF,
            transparent: true,
            opacity: 0.3,
            wireframe: true
        });
        const waves = new THREE.Mesh(waveGeometry, waveMaterial);
        waves.rotation.x = -Math.PI / 2;
        waves.position.set(0, -4.5, 0);
        waves.name = 'storageViz';
        scene.add(waves);
        threeJsInfo.innerHTML = `
            <p>Visualizing <strong>Ocean Storage</strong>. CO₂ is dissolved in the deep ocean or deposited on the seabed. This method has environmental concerns.</p>
        `;

    } else if (storageMethod === "Mineral") {
        const group = new THREE.Group();
        group.name = 'storageViz';
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                const mineralGeometry = new THREE.BoxGeometry(2, 2, 2);
                const mineralMaterial = new THREE.MeshStandardMaterial({
                    color: new THREE.Color(0x708090).lerp(new THREE.Color(0xAAAAAA), Math.random()),
                    roughness: 0.6,
                    metalness: 0.3
                });
                const mineral = new THREE.Mesh(mineralGeometry, mineralMaterial);
                mineral.position.set(-5 + i*2.5, -9, -5 + j*2.2);
                group.add(mineral);
            }
        }
        scene.add(group);
        threeJsInfo.innerHTML = `
            <p>Visualizing <strong>Mineral Storage</strong>. CO₂ reacts with metal oxides in naturally occurring minerals to form stable carbonate minerals.</p>
        `;
    } else if (storageMethod === "Industrial") {
        const group = new THREE.Group();
        group.name = 'storageViz';

        const pipeGeometry = new THREE.CylinderGeometry(0.5, 0.5, 10, 32);
        const pipeMaterial = new THREE.MeshStandardMaterial({ color: 0xC0C0C0 });

        const pipe1 = new THREE.Mesh(pipeGeometry, pipeMaterial);
        pipe1.position.set(-5, -5, 0);
        pipe1.rotation.z = Math.PI / 2;
        group.add(pipe1);

        const pipe2 = new THREE.Mesh(pipeGeometry, pipeMaterial);
        pipe2.position.set(5, -5, 0);
        pipe2.rotation.z = Math.PI / 2;
        group.add(pipe2);

        const tankGeometry = new THREE.CylinderGeometry(3, 3, 6, 32);
        const tankMaterial = new THREE.MeshStandardMaterial({ color: 0xA9A9A9 });
        const tank = new THREE.Mesh(tankGeometry, tankMaterial);
        tank.position.set(0, -7, 0);
        group.add(tank);

        const buildingGeometry = new THREE.BoxGeometry(10, 8, 8);
        const buildingMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
        const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
        building.position.set(0, -6, 0);
        group.add(building);

        scene.add(group);
        threeJsInfo.innerHTML = `
            <p>Visualizing <strong>Industrial Use</strong>. Captured CO₂ is used as a resource in various industries (e.g., chemicals, enhanced oil recovery).</p>
        `;
    }
}

function updateThreeJSVisualization(capturedPercentage, remainingPercentage, energy, cost) {
    capturedParticles.forEach(particleSystem => scene.remove(particleSystem));
    remainingParticles.forEach(particleSystem => scene.remove(particleSystem));
    capturedParticles = [];
    remainingParticles = [];

    createStorageVisualization();

    const totalParticles = 2000;
    const capturedCount = Math.round(totalParticles * capturedPercentage / 100);
    const remainingCount = Math.round(totalParticles * remainingPercentage / 100);

    if (capturedCount > 0) {
        const capturedPositions = new Float32Array(capturedCount * 3);
        for (let i = 0; i < capturedCount; i++) {
            capturedPositions[i * 3] = (Math.random() - 0.5) * 15;
            capturedPositions[i * 3 + 1] = Math.random() * 10 + 5;
            capturedPositions[i * 3 + 2] = (Math.random() - 0.5) * 15;
        }
        const capturedGeometry = new THREE.BufferGeometry();
        capturedGeometry.setAttribute('position', new THREE.BufferAttribute(capturedPositions, 3));
        const capturedMaterial = new THREE.PointsMaterial({
            color: 0x0077ff,
            size: 0.2,
            transparent: true,
            opacity: 0.7
        });
        const capturedParticleSystem = new THREE.Points(capturedGeometry, capturedMaterial);
        scene.add(capturedParticleSystem);
        capturedParticles.push(capturedParticleSystem);
    }

    if (remainingCount > 0) {
        const remainingPositions = new Float32Array(remainingCount * 3);
        for (let i = 0; i < remainingCount; i++) {
            remainingPositions[i * 3] = (Math.random() - 0.5) * 15;
            remainingPositions[i * 3 + 1] = Math.random() * 10 - 2;
            remainingPositions[i * 3 + 2] = (Math.random() - 0.5) * 15;
        }
        const remainingGeometry = new THREE.BufferGeometry();
        remainingGeometry.setAttribute('position', new THREE.BufferAttribute(remainingPositions, 3));
        const remainingMaterial = new THREE.PointsMaterial({
            color: 0xff3300,
            size: 0.2,
            transparent: true,
            opacity: 0.7
        });
        const remainingParticleSystem = new THREE.Points(remainingGeometry, remainingMaterial);
        scene.add(remainingParticleSystem);
        remainingParticles.push(remainingParticleSystem);
    }
}

function animate(timestamp) {
    requestAnimationFrame(animate);

    frameCount++;
    if (timestamp >= lastTimestamp + 1000) {
        fps = frameCount * 1000 / (timestamp - lastTimestamp);
        frameCount = 0;
        lastTimestamp = timestamp;
    }

    capturedParticles.forEach(particleSystem => {
        const positions = particleSystem.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 1] -= 0.1;
            if (positions[i + 1] < -9) positions[i + 1] = 10;

            positions[i] += (Math.random() - 0.5) * 0.05;
            positions[i + 2] += (Math.random() - 0.5) * 0.05;
        }
        particleSystem.geometry.attributes.position.needsUpdate = true;
    });

    remainingParticles.forEach(particleSystem => {
        const positions = particleSystem.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 1] += 0.05;
            if (positions[i + 1] > 15) positions[i + 1] = -5;

            positions[i] += (Math.random() - 0.5) * 0.03;
            positions[i + 2] += (Math.random() - 0.5) * 0.03;
        }
        particleSystem.geometry.attributes.position.needsUpdate = true;
    });

    scene.children.forEach(obj => {
        if (obj.name === 'storageViz' && obj.material && obj.material.wireframe === true && obj.geometry && obj.geometry.attributes.position) {
            const positions = obj.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 2] = Math.sin(positions[i] * 0.5 + timestamp * 0.002) * 0.5 + Math.cos(positions[i+1] * 0.5 + timestamp * 0.002) * 0.5;
            }
            obj.geometry.attributes.position.needsUpdate = true;
        }
    });

    renderer.render(scene, camera);
}

function initializeCharts() {
    efficiencyChart = new Chart(efficiencyChartCanvas, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Efficiency (%)',
                data: [],
                backgroundColor: 'rgba(39, 174, 96, 0.2)',
                borderColor: 'var(--success-color)',
                borderWidth: 2,
                tension: 0.3,
                pointBackgroundColor: 'var(--success-color)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'var(--success-color)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Efficiency (%)'
                    },
                    max: 100
                },
                x: {
                    title: {
                        display: true,
                        text: 'Simulation Run'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            }
        }
    });

    costChart = new Chart(costChartCanvas, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Cost ($/ton)',
                data: [],
                backgroundColor: 'rgba(52, 152, 219, 0.6)',
                borderColor: 'var(--secondary-color)',
                borderWidth: 1,
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Cost ($/ton CO₂)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Simulation Run'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            }
        }
    });
}

function runSimulation() {
    const captureType = captureTypeSelect.value;
    const techRoute = techRouteSelect.value;
    const storageMethod = storageMethodSelect.value;
    const temperature = parseFloat(temperatureSlider.value);
    const pressure = parseFloat(pressureSlider.value);

    const co2InputFlow = 100;

    let capturedAmount = 0;
    let efficiencyCalcFunc;

    switch (techRoute) {
        case "Solvent Absorption":
            efficiencyCalcFunc = solventAbsorption;
            break;
        case "Membrane Separation":
            efficiencyCalcFunc = membraneSeparation;
            break;
        case "Mineralization":
            efficiencyCalcFunc = mineralization;
            break;
        case "Cryogenic":
            efficiencyCalcFunc = cryogenicSeparation;
            break;
        case "Adsorption":
            efficiencyCalcFunc = adsorption;
            break;
        case "Bio-sequestration":
            efficiencyCalcFunc = bioSequestration;
            break;
        default:
            efficiencyCalcFunc = (co2, temp, pressure) => co2 * 0.7;
    }

    if (techRoute === "Mineralization" || techRoute === "Cryogenic" || techRoute === "Bio-sequestration") {
        capturedAmount = efficiencyCalcFunc(co2InputFlow, temperature);
    } else {
        capturedAmount = efficiencyCalcFunc(co2InputFlow, temperature, pressure);
    }

    capturedAmount = Math.max(0, Math.min(co2InputFlow, capturedAmount));

    const capturedPercentage = (capturedAmount / co2InputFlow) * 100;
    const remainingPercentage = 100 - capturedPercentage;
    const efficiency = capturedPercentage;

    const energyConsumption = calculateEnergy(techRoute, capturedAmount, temperature, pressure);
    const costPerTon = calculateCost(techRoute, storageMethod, capturedAmount, energyConsumption);

    const results = {
        co2Input: "N/A",
        co2Flow: co2InputFlow.toFixed(2),
        capturedPercentage: capturedPercentage.toFixed(2),
        remainingPercentage: remainingPercentage.toFixed(2),
        efficiency: efficiency.toFixed(2),
        energyConsumption: energyConsumption.toFixed(2),
        costPerTon: costPerTon.toFixed(2)
    };

    updateResultsTable(results);
    updateCharts(results);
    updateThreeJSVisualization(capturedPercentage, remainingPercentage, energyConsumption, costPerTon);
}

function updateResultsTable(results) {
    const newRow = resultsTableBody.insertRow();
    newRow.insertCell().textContent = results.co2Input;
    newRow.insertCell().textContent = `${results.co2Flow} kg/s`;
    newRow.insertCell().textContent = `${results.capturedPercentage}%`;
    newRow.insertCell().textContent = `${results.remainingPercentage}%`;
    newRow.insertCell().textContent = `${results.efficiency}%`;
    newRow.insertCell().textContent = `${results.energyConsumption} kWh/kg`;
    newRow.insertCell().textContent = `$${results.costPerTon}/ton`;

    if (resultsTableBody.rows.length > 10) {
        resultsTableBody.deleteRow(0);
    }
}

function updateCharts(results) {
    simulationHistory.push(results);

    const labels = simulationHistory.map((_, index) => `Run ${index + 1}`);
    const efficiencies = simulationHistory.map(sim => parseFloat(sim.efficiency));
    const costs = simulationHistory.map(sim => parseFloat(sim.costPerTon));

    efficiencyChart.data.labels = labels;
    efficiencyChart.data.datasets[0].data = efficiencies;
    efficiencyChart.update();

    costChart.data.labels = labels;
    costChart.data.datasets[0].data = costs;
    costChart.update();
}

// Event Listeners
temperatureSlider.addEventListener('input', () => {
    tempValueDisplay.textContent = `${temperatureSlider.value}°C`;
});

pressureSlider.addEventListener('input', () => {
    pressureValueDisplay.textContent = `${pressureSlider.value} atm`;
});

captureTypeSelect.addEventListener('change', createStorageVisualization);
techRouteSelect.addEventListener('change', createStorageVisualization);
storageMethodSelect.addEventListener('change', createStorageVisualization);

runSimulationButton.addEventListener('click', runSimulation);

document.addEventListener('DOMContentLoaded', () => {
    initializeCharts();
    initThreeJS();
    runSimulation();
});