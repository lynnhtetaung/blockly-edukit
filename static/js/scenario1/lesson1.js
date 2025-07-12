

let workspace;
let currentCode = '';

// Define custom blocks and generators BEFORE creating workspace
function setupCustomBlocks() {
    console.log('Setting up custom blocks...');

    // Method 1: Try direct assignment to Blockly.Python
    try {
        // Import board
        Blockly.Blocks['import_board_dht'] = {
            init: function () {
                this.appendDummyInput().appendField("import board");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(230);
                this.setTooltip("Import board module");
            }
        }

        Blockly.Python['import_board_dht'] = function (block) {
            return 'import board\n';
        };

        // Import adafruit_dht
        Blockly.Blocks['import_adafruit_dht'] = {
            init: function () {
                this.appendDummyInput().appendField("import adafruit_dht");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(230);
                this.setTooltip("Import adafruit_dht module");
            }
        };

        Blockly.Python['import_adafruit_dht'] = function (block) {
            return 'import adafruit_dht\n';
        };

        // Create DHT device
        Blockly.Blocks['create_dht_device'] = {
            init: function () {
                this.appendDummyInput().appendField("dhtDevice = adafruit_dht.DHT22(board.D13, use_pulseio=False)");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(120);
                this.setTooltip("Create DHT22 device");
            }
        };

        Blockly.Python['create_dht_device'] = function (block) {
            return 'dhtDevice = adafruit_dht.DHT22(board.D13, use_pulseio=False)\n';
        };

        // Read temperature
        Blockly.Blocks['read_temperature_dht'] = {
            init: function () {
                this.appendDummyInput().appendField("temperature_c = dhtDevice.temperature");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(120);
                this.setTooltip("Read temperature");
            }
        };

        Blockly.Python['read_temperature_dht'] = function (block) {
            return 'temperature_c = dhtDevice.temperature\n';
        };

        // Print temperature
        Blockly.Blocks['print_temperature_dht'] = {
            init: function () {
                this.appendDummyInput().appendField('print(f"Room Temperature: {temperature_c:.1f}°C")');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(120);
                this.setTooltip("Print temperature");
            }
        };

        Blockly.Python['print_temperature_dht'] = function (block) {
            return 'print(f"Room Temperature: {temperature_c:.1f}°C")\n';
        };

        console.log('Custom blocks setup complete');

    } catch (error) {
        console.error('Error setting up custom blocks:', error);
    }

    // Method 2: Try using forBlock if it exists
    try {
        if (Blockly.Python.forBlock) {

            Blockly.Python.forBlock['import_board_dht'] = function (block) {
                return 'import board\n';
            };

            Blockly.Python.forBlock['import_adafruit_dht'] = function (block) {
                return 'import adafruit_dht\n';
            };

            Blockly.Python.forBlock['create_dht_device'] = function (block) {
                return 'dhtDevice = adafruit_dht.DHT22(board.D13, use_pulseio=False)\n';
            };

            Blockly.Python.forBlock['read_temperature_dht'] = function (block) {
                return 'temperature_c = dhtDevice.temperature\n';
            };

            Blockly.Python.forBlock['print_temperature_dht'] = function (block) {
                return 'print(f"Room Temperature: {temperature_c:.1f}°C")\n';
            };

            console.log('forBlock generators setup complete');
        }
    } catch (error) {
        console.error('Error setting up forBlock generators:', error);
    }
}

// Python code simulator
function simulatePythonExecution(code) {
    const outputElement = document.getElementById('executionOutput');
    const statusIndicator = document.getElementById('statusIndicator');

    // Set status to running
    statusIndicator.className = 'status-indicator status-running';
    outputElement.textContent = '📡 Fetching real DHT22 temperature data...\n';

    return fetch('/api/dht22/live')
        .then(response => response.json())
        .then(sensorData => {
            return new Promise((resolve) => {
                try {
                    let output = '';
                    const lines = code.split('\n').filter(line => line.trim() !== '');
                    const temperature = sensorData.dht22_temp?.toFixed(1) || 'N/A';
                    const timestamp = sensorData.timestamp || 'Unknown';

                    let currentStep = 0;

                    function executeStep() {
                        if (currentStep < lines.length) {
                            const line = lines[currentStep].trim();

                            if (line.startsWith('import ')) {
                                output += `✓ ${line}\n`;
                            } else if (line.includes('adafruit_dht.DHT22')) {
                                output += `✓ ${line}\n`;
                                output += `  └─ DHT22 sensor initialized on pin D13\n`;
                            } else if (line.includes('temperature_c = dhtDevice.temperature')) {
                                output += `✓ ${line}\n`;
                                output += `  └─ Reading sensor... Temperature: ${temperature}°C\n`;
                                window.simulatedTemperature = temperature;
                            } else if (line.includes('print(f"Room Temperature:')) {
                                const temp = window.simulatedTemperature || 'N/A';
                                output += `✓ ${line}\n`;
                                output += `📊 Temperature: ${temp}°C\n`;
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
                            output += '\n🎉 Execution completed successfully!';
                            outputElement.textContent = output;
                            statusIndicator.className = 'status-indicator status-ready';
                            resolve(output);
                        }
                    }

                    executeStep();

                } catch (error) {
                    statusIndicator.className = 'status-indicator status-error';
                    const errorOutput = `❌ Error during execution:\n${error.message}\n\nNote: This is a simulation of Python code execution.\nActual hardware interaction would require a real DHT22 sensor.`;
                    outputElement.textContent = errorOutput;
                    resolve(errorOutput);
                }
            });
        })
        .catch(error => {
            statusIndicator.className = 'status-indicator status-error';
            const errorOutput = `❌ Failed to fetch real DHT22 data:\n${error.message}`;
            outputElement.textContent = errorOutput;
            return Promise.resolve(errorOutput);
        });
}

// Initialize everything
function initializeEverything() {
    console.log('Starting initialization...');
    console.log('Blockly available:', typeof Blockly !== 'undefined');
    console.log('Blockly.Python available:', typeof Blockly.Python !== 'undefined');

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

        // Log available generators
        console.log('Available Python generators:');
        for (let key in Blockly.Python) {
            if (typeof Blockly.Python[key] === 'function' && key.includes('dht')) {
                console.log('  -', key);
            }
        }

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
        console.log('Generating code...');

        // Get all blocks
        const blocks = workspace.getAllBlocks();
        console.log('Blocks in workspace:', blocks.length);

        for (let block of blocks) {
            console.log('Block type:', block.type, 'Generator exists:', typeof Blockly.Python[block.type] === 'function');
        }

        const code = Blockly.Python.workspaceToCode(workspace);
        console.log('Generated code:', code);

        if (code.trim() === '') {
            document.getElementById('output').textContent = '# No blocks in workspace\n# Drag blocks from the toolbox to generate code';
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
        document.getElementById('executionOutput').textContent = '❌ No code to run!\nGenerate Python code first by clicking "Generate Python Code".';
        document.getElementById('sendBtn').style.display = "none";
        return;
    }

    document.getElementById('executionOutput').textContent = '🚀 Starting code execution...\n\nNote: This is a simulation since we cannot run actual Python hardware code in a browser.';
    document.getElementById('sendBtn').style.display = "none";
    
    const result = await simulatePythonExecution(currentCode);

    // Show the button only if result contains a success indicator
    if (
        typeof result === "string" &&
        result.toLowerCase().includes('temperature') &&
        !result.toLowerCase().includes('error')
    ) {
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
    }
}

function callSemarAPI(sensorType) {
    const endpoint = `/api/semar/${sensorType}`;

    fetch(endpoint, {
        method: 'POST'
    })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            alert("✅ Sensor data sent successfully!\n\n" +
                `Status: ${data.status}\n` +
                `Response: ${data.response}`);
        })
        .catch(error => {
            alert("❌ Failed to send sensor data.\n\n" + error.message);
        });
}



// Wait for everything to load
window.addEventListener('load', function () {
    setTimeout(initializeEverything, 500);
});
