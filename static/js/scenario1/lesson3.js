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

        // Infinite loop (while True)
        Blockly.Blocks['infinite_loop'] = {
            init: function () {
                this.appendDummyInput().appendField("while True:");
                this.appendStatementInput("DO").setCheck(null);
                this.setPreviousStatement(true, null);
                this.setColour(290);
                this.setTooltip("Infinite loop - runs forever");
            }
        };

        Blockly.Python['infinite_loop'] = function (block) {
            var statements_do = Blockly.Python.statementToCode(block, 'DO');
            var code = 'while True:\n' + statements_do;
            return code;
        };

        // Water detected condition
        Blockly.Blocks['water_detected_condition'] = {
            init: function () {
                this.appendDummyInput().appendField("if GPIO.input(WATER_SENSOR_PIN) == GPIO.LOW:");
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
            var code = 'if GPIO.input(WATER_SENSOR_PIN) == GPIO.LOW:\n' +
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

            Blockly.Python.forBlock['infinite_loop'] = function (block) {
                var statements_do = Blockly.Python.statementToCode(block, 'DO');
                var code = 'while True:\n' + statements_do;
                return code;
            };

            Blockly.Python.forBlock['water_detected_condition'] = function (block) {
                var statements_if_true = Blockly.Python.statementToCode(block, 'IF_TRUE');
                var statements_if_false = Blockly.Python.statementToCode(block, 'IF_FALSE');
                var code = 'if GPIO.input(WATER_SENSOR_PIN) == GPIO.LOW:\n' +
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
function simulateWaterSensor(code) {
    const outputElement = document.getElementById('executionOutput');
    const statusIndicator = document.getElementById('statusIndicator');

    statusIndicator.className = 'status-indicator status-running';
    outputElement.textContent = '📡 Checking real water sensor status...\n';

    fetch('/api/water_sensor/live')
        .then(response => response.json())
        .then(data => {
            const timestamp = data.timestamp || new Date().toLocaleTimeString();
            const detected = data.water_detected;

            let output = '';
            output += `🟢 Water sensor check initiated at ${timestamp}\n`;

            if (detected) {
                output += `💧 Water detected on GPIO17!\n`;
            } else {
                output += `⚠️ No water detected on GPIO17.\n`;
            }

            output += '\n🎉 Real-time sensor check complete!';
            outputElement.textContent = output;
            statusIndicator.className = 'status-indicator status-ready';
        })
        .catch(error => {
            const errorOutput = `❌ Failed to fetch water sensor data:\n${error.message}`;
            outputElement.textContent = errorOutput;
            statusIndicator.className = 'status-indicator status-error';
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
        document.getElementById('executionOutput').textContent = '❌ No code to run!\nGenerate Python code first by clicking "Generate Python Code".';
        document.getElementById('sendBtn').style.display = "none";
        return;
    }

    if (simulationRunning) {
        simulationRunning = false;
        document.getElementById('executionOutput').textContent = '⏹️ Simulation stopped by user.';
        document.getElementById('sendBtn').style.display = "none";

        document.getElementById('statusIndicator').className = 'status-indicator status-ready';
        return;
    }

    document.getElementById('executionOutput').textContent = '🚀 Starting water sensor simulation...\n\nNote: This simulates the water sensor behavior since we cannot access real GPIO pins in a browser.';
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
        simulationRunning = false;
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