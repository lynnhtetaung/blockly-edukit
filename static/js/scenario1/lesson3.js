let workspace;
let currentCode = '';
let simulationRunning = false;

// Define custom blocks and generators
function setupCustomBlocks() {
    console.log('Setting up water sensor blocks...');

    try {
        // Import RPi.GPIO
        Blockly.Blocks['import_rpi_gpio'] = {
            init: function () {
                this.appendDummyInput().appendField("import RPi.GPIO as GPIO");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(230);
                this.setTooltip("Import Raspberry Pi GPIO library");
            }
        };

        Blockly.Python['import_rpi_gpio'] = function (block) {
            return 'import RPi.GPIO as GPIO\n';
        };

        // Import time
        Blockly.Blocks['import_time'] = {
            init: function () {
                this.appendDummyInput().appendField("import time");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(230);
                this.setTooltip("Import time module for delays");
            }
        };

        Blockly.Python['import_time'] = function (block) {
            return 'import time\n';
        };

        // GPIO setmode
        Blockly.Blocks['gpio_setmode'] = {
            init: function () {
                this.appendDummyInput().appendField("GPIO.setmode(GPIO.BCM)");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(120);
                this.setTooltip("Set GPIO pin numbering mode to BCM");
            }
        };

        Blockly.Python['gpio_setmode'] = function (block) {
            return 'GPIO.setmode(GPIO.BCM)\n';
        };

        // Setup water sensor pin
        Blockly.Blocks['setup_water_pin'] = {
            init: function () {
                this.appendDummyInput().appendField("WATER_SENSOR_PIN = 17");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(120);
                this.setTooltip("Set pin 17 for water sensor");
            }
        };

        Blockly.Python['setup_water_pin'] = function (block) {
            return 'WATER_SENSOR_PIN = 17\n';
        };

        // GPIO setup input
        Blockly.Blocks['gpio_setup_input'] = {
            init: function () {
                this.appendDummyInput().appendField("GPIO.setup(WATER_SENSOR_PIN, GPIO.IN)");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(120);
                this.setTooltip("Configure sensor pin as input");
            }
        };

        Blockly.Python['gpio_setup_input'] = function (block) {
            return 'GPIO.setup(WATER_SENSOR_PIN, GPIO.IN)\n';
        };

        // Water detected condition
        Blockly.Blocks['water_detected_condition'] = {
            init: function () {
                this.appendDummyInput().appendField("if GPIO.input(WATER_SENSOR_PIN) == GPIO.HIGH:");
                this.appendStatementInput("IF_TRUE").setCheck(null);
                this.appendDummyInput().appendField("else:");
                this.appendStatementInput("IF_FALSE").setCheck(null);
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(180);
                this.setTooltip("Check if water is detected");
            }
        };

        Blockly.Python['water_detected_condition'] = function (block) {
            var statements_if_true = Blockly.Python.statementToCode(block, 'IF_TRUE');
            var statements_if_false = Blockly.Python.statementToCode(block, 'IF_FALSE');
            var code = 'if GPIO.input(WATER_SENSOR_PIN) == GPIO.HIGH:\n' +
                statements_if_true +
                'else:\n' +
                statements_if_false;
            return code;
        };

        // Print water detected
        Blockly.Blocks['print_water_detected'] = {
            init: function () {
                this.appendDummyInput().appendField('print("💧 Water detected!")');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(180);
                this.setTooltip("Print water detected message");
            }
        };

        Blockly.Python['print_water_detected'] = function (block) {
            return 'print("💧 Water detected!")\n';
        };

        // Print no water
        Blockly.Blocks['print_no_water'] = {
            init: function () {
                this.appendDummyInput().appendField('print("⚠️ No water detected.")');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(180);
                this.setTooltip("Print no water message");
            }
        };

        Blockly.Python['print_no_water'] = function (block) {
            return 'print("⚠️ No water detected.")\n';
        };

        // Delay one second
        Blockly.Blocks['delay_one_second'] = {
            init: function () {
                this.appendDummyInput().appendField("time.sleep(1)");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(180);
                this.setTooltip("Wait 1 second");
            }
        };

        Blockly.Python['delay_one_second'] = function (block) {
            return 'time.sleep(1)\n';
        };

        console.log('Water sensor blocks setup complete');

    } catch (error) {
        console.error('Error setting up custom blocks:', error);
    }

    // Method 2: Try using forBlock if it exists
    try {
        if (Blockly.Python.forBlock) {
            Blockly.Python.forBlock['import_rpi_gpio'] = function (block) {
                return 'import RPi.GPIO as GPIO\n';
            };

            Blockly.Python.forBlock['import_time'] = function (block) {
                return 'import time\n';
            };

            Blockly.Python.forBlock['gpio_setmode'] = function (block) {
                return 'GPIO.setmode(GPIO.BCM)\n';
            };

            Blockly.Python.forBlock['setup_water_pin'] = function (block) {
                return 'WATER_SENSOR_PIN = 17\n';
            };

            Blockly.Python.forBlock['gpio_setup_input'] = function (block) {
                return 'GPIO.setup(WATER_SENSOR_PIN, GPIO.IN)\n';
            };

            Blockly.Python.forBlock['water_detected_condition'] = function (block) {
                var statements_if_true = Blockly.Python.statementToCode(block, 'IF_TRUE');
                var statements_if_false = Blockly.Python.statementToCode(block, 'IF_FALSE');
                var code = 'if GPIO.input(WATER_SENSOR_PIN) == GPIO.HIGH:\n' +
                    statements_if_true +
                    'else:\n' +
                    statements_if_false;
                return code;
            };

            Blockly.Python.forBlock['read_water_sensor'] = function (block) {
                return ['GPIO.input(WATER_SENSOR_PIN)', Blockly.Python.ORDER_FUNCTION_CALL];
            };

            Blockly.Python.forBlock['print_water_detected'] = function (block) {
                return 'print("💧 Water detected!")\n';
            };

            Blockly.Python.forBlock['print_no_water'] = function (block) {
                return 'print("⚠️ No water detected.")\n';
            };

            Blockly.Python.forBlock['delay_one_second'] = function (block) {
                return 'time.sleep(1)\n';
            };

            console.log('forBlock generators setup complete');
        }
    } catch (error) {
        console.error('Error setting up forBlock generators:', error);
    }
}

// Water sensor simulation
function simulatePythonExecution(code) {
    const outputElement = document.getElementById('executionOutput');
    const statusIndicator = document.getElementById('statusIndicator');

    statusIndicator.className = 'status-indicator status-running';
    outputElement.textContent = '\uD83D\uDCE1 Checking real water sensor status...\n';

    return fetch('/api/water_sensor/live')
        .then(response => response.json())
        .then(data => {
            return new Promise((resolve) => {
                try {
                    let output = '';
                    const lines = code.split('\n').filter(line => line.trim() !== '');
                    const detected = data.water_detected;
                    const timestamp = data.timestamp || new Date().toLocaleTimeString();
                    window.simulatedWaterDetected = detected;

                    let currentStep = 0;

                    function executeStep() {
                        if (currentStep < lines.length) {
                            const line = lines[currentStep].trim();
                            if (line.startsWith('import ')) {
                                output += `✓ ${line}\n`;
                            } else if (line.includes('GPIO.setmode')) {
                                output += `✓ ${line}\n`;
                                output += `  └─ GPIO set to BCM mode\n`;
                            } else if (line.includes('WATER_SENSOR_PIN')) {
                                output += `✓ ${line}\n`;
                                output += `  └─ Water sensor pin set to GPIO17\n`;
                            } else if (line.includes('GPIO.setup')) {
                                output += `✓ ${line}\n`;
                                output += `  └─ Pin configured as input\n`;
                            } else if (line.includes('GPIO.input(WATER_SENSOR_PIN)')) {
                                output += `✓ ${line}\n`;
                                if (detected === true) {
                                    output += `  └─ Reading sensor... Water detected!\n`;
                                } else if (detected === false) {
                                    output += `  └─ Reading sensor... No water detected.\n`;
                                } else {
                                    output += `  └─ Reading sensor... Unknown state.\n`;
                                }
                            } else if (line.startsWith('print(')) {
                                const match = line.match(/print\(['"](.+?)['"]\)/);
                                if (match) {
                                    output += `✓ ${line}\n`;
                                    output += `📝 ${match[1]}\n`;
                                } else {
                                    output += `✓ ${line}\n`;
                                }
                            } else if (line !== '') {
                                output += `✓ ${line}\n`;
                            }

                            outputElement.textContent = output + '\n⏳ Executing...';
                            currentStep++;
                            setTimeout(executeStep, 300);
                        } else {
                            output += `\n🕒 Timestamp: ${timestamp}\n`;
                            if (detected === true || detected === false) {
                                output += '\n🎉 Execution completed successfully!';
                            } else {
                                output += '\n❌ No data read. Please connect the sensor to the hardware.';
                            }
                            outputElement.textContent = output;
                            statusIndicator.className = 'status-indicator status-ready';
                            resolve(output);
                        }
                    }

                    executeStep();
                } catch (error) {
                    statusIndicator.className = 'status-indicator status-error';
                    const errorOutput = `❌ Error during execution:\n${error.message}\n\nNote: This is a simulation of Python code execution.\nActual hardware interaction would require a real water sensor.`;
                    outputElement.textContent = errorOutput;
                    resolve(errorOutput);
                }
            });
        })
        .catch(error => {
            statusIndicator.className = 'status-indicator status-error';
            const errorOutput = `\u274c Failed to fetch water sensor data:\n${error.message}`;
            outputElement.textContent = errorOutput;
            return Promise.resolve(errorOutput);
        });
}


// Initialize everything
function initializeEverything() {
    console.log('Starting initialization...');

    if (typeof Blockly === 'undefined' || typeof Blockly.Python === 'undefined') {
        console.error('Blockly or Blockly.Python not available');
        document.getElementById('output').innerHTML = '<span style="color: red;">Blockly not properly loaded</span>';
        return;
    }

    // Setup custom blocks and generators
    setupCustomBlocks();

    // Create workspace
    try {
        workspace = Blockly.inject('blocklyDiv', {
            toolbox: document.getElementById('toolbox'),
            scrollbars: true,
            trashcan: true,
            grid: {
                spacing: 20,
                length: 3,
                colour: '#ccc',
                snap: true
            },
            zoom: {
                controls: true,
                wheel: true,
                startScale: 1.0,
                maxScale: 3,
                minScale: 0.3,
                scaleSpeed: 1.2
            }
        });

        console.log('Workspace created successfully');

    } catch (error) {
        console.error('Error creating workspace:', error);
        document.getElementById('output').innerHTML = '<span style="color: red;">Error creating workspace: ' + error.message + '</span>';
    }
}

function generateCode() {
    if (!workspace) {
        document.getElementById('output').textContent = 'Workspace not ready';
        return;
    }

    try {
        const code = Blockly.Python.workspaceToCode(workspace);

        if (code.trim() === '') {
            document.getElementById('output').textContent = '# No blocks in workspace\n# Drag blocks from the toolbox to generate code\n# Or click "Load Complete Example" for a ready-to-use program';
            currentCode = '';
        } else {
            document.getElementById('output').textContent = code;
            currentCode = code;
        }

    } catch (error) {
        console.error('Code generation error:', error);
        document.getElementById('output').innerHTML = '<span style="color: #ff6b6b;">Error: ' + error.message + '</span>';
        currentCode = '';
    }
}

async function runCode() {
    if (!currentCode || currentCode.trim() === '') {
        document.getElementById('executionOutput').textContent = '\u274c No code to run!\nGenerate Python code first by clicking "Generate Python Code".';
        document.getElementById('sendBtn').style.display = "none";
        return;
    }

    if (simulationRunning) {
        simulationRunning = false;
        document.getElementById('executionOutput').textContent = '\u23f9\uFE0F Simulation stopped by user.';
        document.getElementById('sendBtn').style.display = "none";
        document.getElementById('statusIndicator').className = 'status-indicator status-ready';
        return;
    }

    document.getElementById('executionOutput').textContent = '\uD83D\uDE80 Starting water sensor simulation...\n\nNote: This simulates water sensor behavior since we cannot access real GPIO pins in a browser.';
    document.getElementById('sendBtn').style.display = "none";

    const result = await simulatePythonExecution(currentCode);

    // Only show the button if water is detected (strict true)
    if (window.simulatedWaterDetected === true) {
        document.getElementById('sendBtn').style.display = "inline-block";
    } else {
        document.getElementById('sendBtn').style.display = "none";
    }
}

function clearWorkspace() {
    if (workspace) {
        workspace.clear();
        document.getElementById('output').textContent = 'Click "Generate Python Code" to generate the python code';
        document.getElementById('executionOutput').textContent = 'Click "Execute" to see the sensor data output';
        document.getElementById('statusIndicator').className = 'status-indicator status-ready';
        currentCode = '';
        simulationRunning = false;
    }
}

function showSemarModal(status, message) {
    const modal = document.getElementById('semarModal');
    const statusDiv = document.getElementById('semarModalStatus');
    const closeBtn = document.getElementById('semarModalClose');
    modal.style.display = 'flex';
    statusDiv.innerHTML = `
      <div class="semar-modal-spinner"></div>
      <div class="semar-modal-message">${message || 'Sending data to SEMAR...'}</div>
    `;
    closeBtn.style.display = 'none';
}

function updateSemarModalSuccess(response) {
    const statusDiv = document.getElementById('semarModalStatus');
    // Accept 2xx as success, otherwise treat as error
    let status = response.status;
    if (typeof status === 'string') status = parseInt(status);
    if (status >= 200 && status < 300) {
        statusDiv.innerHTML = `
          <div class="semar-modal-success">🎉</div>
          <div class="semar-modal-message">Sensor data sent successfully!</div>
          <div style="color:#27ae60; font-size:1rem; margin-bottom:0.5rem;">Status: ${response.status}</div>
          <div style="color:#2c3e50; font-size:0.95rem;">${response.response || ''}</div>
        `;
    } else {
        statusDiv.innerHTML = `
          <div class="semar-modal-error">❌</div>
          <div class="semar-modal-message">Failed to send sensor data.</div>
          <div style="color:#e74c3c; font-size:1rem;">Status: ${response.status}</div>
          <div style="color:#e74c3c; font-size:0.95rem;">${response.detail || response.response || ''}</div>
        `;
    }
    document.getElementById('semarModalClose').style.display = 'block';
}

function updateSemarModalError(errorMsg) {
    const statusDiv = document.getElementById('semarModalStatus');
    statusDiv.innerHTML = `
      <div class="semar-modal-error">❌</div>
      <div class="semar-modal-message">Failed to send sensor data.</div>
      <div style="color:#e74c3c; font-size:1rem;">${errorMsg}</div>
    `;
    document.getElementById('semarModalClose').style.display = 'block';
}

function hideSemarModal() {
    document.getElementById('semarModal').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    const closeBtn = document.getElementById('semarModalClose');
    if (closeBtn) {
        closeBtn.onclick = hideSemarModal;
    }
    // Also close modal if user clicks outside content
    const modal = document.getElementById('semarModal');
    if (modal) {
        modal.onclick = function(e) {
            if (e.target === modal) hideSemarModal();
        };
    }
});

function callSemarAPI(sensorType) {
    showSemarModal('sending', 'Sending data to SEMAR...');
    const endpoint = `/api/semar/${sensorType}`;
    fetch(endpoint, {
        method: 'POST'
    })
        .then(async response => {
            let data;
            try { data = await response.json(); } catch { data = {}; }
            if (!response.ok) {
                let msg = data.detail || data.response || `HTTP error! status: ${response.status}`;
                updateSemarModalError(msg);
                return;
            }
            updateSemarModalSuccess(data);
        })
        .catch(error => {
            updateSemarModalError(error.message);
        });
}

// Wait for everything to load
window.addEventListener('load', function () {
    setTimeout(initializeEverything, 500);
});