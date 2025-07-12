let workspace;
let currentCode = '';

// Define custom blocks and generators with dual method support
function setupCustomBlocks() {
    console.log('Setting up DS18B20 custom blocks with dual methods...');

    try {
        // METHOD 1: Standard Blockly.Python generators

        // Import glob
        Blockly.Blocks['import_glob'] = {
            init: function () {
                this.appendDummyInput().appendField("import glob");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(230);
                this.setTooltip("Import glob module for file pattern matching");
            }
        };

        Blockly.Python['import_glob'] = function (block) {
            return 'import glob\n';
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

        // Get device file
        Blockly.Blocks['get_device_file'] = {
            init: function () {
                this.appendDummyInput().appendField("device_file = glob.glob('/sys/bus/w1/devices/28*/w1_slave')[0]");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(120);
                this.setTooltip("Find DS18B20 device file using glob pattern");
            }
        };

        Blockly.Python['get_device_file'] = function (block) {
            return "device_file = glob.glob('/sys/bus/w1/devices/28*/w1_slave')[0]\n";
        };

        // Define read_temp function
        Blockly.Blocks['define_read_temp_function'] = {
            init: function () {
                this.appendDummyInput().appendField("def read_temp():");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(120);
                this.setTooltip("Define the read_temp function");
            }
        };

        Blockly.Python['define_read_temp_function'] = function (block) {
            return 'def read_temp():\n';
        };

        // Open device file
        Blockly.Blocks['open_device_file'] = {
            init: function () {
                this.appendDummyInput().appendField("    with open(device_file, 'r') as f:");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(160);
                this.setTooltip("Open device file for reading");
            }
        };

        Blockly.Python['open_device_file'] = function (block) {
            return "    with open(device_file, 'r') as f:\n";
        };

        // Read lines
        Blockly.Blocks['read_lines'] = {
            init: function () {
                this.appendDummyInput().appendField("        lines = f.readlines()");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(160);
                this.setTooltip("Read all lines from the device file");
            }
        };

        Blockly.Python['read_lines'] = function (block) {
            return "        lines = f.readlines()\n";
        };

        // Check CRC
        Blockly.Blocks['check_crc'] = {
            init: function () {
                this.appendDummyInput().appendField("    if lines[0].strip()[-3:] == 'YES':");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(160);
                this.setTooltip("Check if CRC is valid (YES)");
            }
        };

        Blockly.Python['check_crc'] = function (block) {
            return "    if lines[0].strip()[-3:] == 'YES':\n";
        };

        // Extract temperature
        Blockly.Blocks['extract_temperature'] = {
            init: function () {
                this.appendDummyInput().appendField("        temp_str = lines[1].split('t=')[-1]");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(160);
                this.setTooltip("Extract temperature string from second line");
            }
        };

        Blockly.Python['extract_temperature'] = function (block) {
            return "        temp_str = lines[1].split('t=')[-1]\n";
        };

        // Convert temperature
        Blockly.Blocks['convert_temperature'] = {
            init: function () {
                this.appendDummyInput().appendField("        return float(temp_str) / 1000.0");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(160);
                this.setTooltip("Convert temperature from millidegrees to degrees Celsius");
            }
        };

        Blockly.Python['convert_temperature'] = function (block) {
            return "        return float(temp_str) / 1000.0\n";
        };

        // While True loop
        Blockly.Blocks['while_true_loop'] = {
            init: function () {
                this.appendDummyInput().appendField("while True:");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(65);
                this.setTooltip("Start infinite loop");
            }
        };

        Blockly.Python['while_true_loop'] = function (block) {
            return 'while True:\n';
        };

        // Call read_temp
        Blockly.Blocks['call_read_temp'] = {
            init: function () {
                this.appendDummyInput().appendField("    temp = read_temp()");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(65);
                this.setTooltip("Call read_temp function and store result");
            }
        };

        Blockly.Python['call_read_temp'] = function (block) {
            return '    temp = read_temp()\n';
        };

        // Print temperature
        Blockly.Blocks['print_temperature'] = {
            init: function () {
                this.appendDummyInput().appendField('    print(f"Temperature: {temp:.2f}°C")');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(65);
                this.setTooltip("Print temperature with 2 decimal places");
            }
        };

        Blockly.Python['print_temperature'] = function (block) {
            return '    print(f"Temperature: {temp:.2f}°C")\n';
        };

        // Sleep delay
        Blockly.Blocks['sleep_delay'] = {
            init: function () {
                this.appendDummyInput().appendField("    time.sleep(1)");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(65);
                this.setTooltip("Wait for 1 second");
            }
        };

        Blockly.Python['sleep_delay'] = function (block) {
            return '    time.sleep(1)\n';
        };

        console.log('Standard generators setup complete');

        // METHOD 2: forBlock generators for enhanced compatibility
        try {
            if (Blockly.Python.forBlock) {
                Blockly.Python.forBlock['import_glob'] = function (block) {
                    return 'import glob\n';
                };

                Blockly.Python.forBlock['import_time'] = function (block) {
                    return 'import time\n';
                };

                Blockly.Python.forBlock['get_device_file'] = function (block) {
                    return "device_file = glob.glob('/sys/bus/w1/devices/28*/w1_slave')[0]\n";
                };

                Blockly.Python.forBlock['define_read_temp_function'] = function (block) {
                    return 'def read_temp():\n';
                };

                Blockly.Python.forBlock['open_device_file'] = function (block) {
                    return "    with open(device_file, 'r') as f:\n";
                };

                Blockly.Python.forBlock['read_lines'] = function (block) {
                    return "        lines = f.readlines()\n";
                };

                Blockly.Python.forBlock['check_crc'] = function (block) {
                    return "    if lines[0].strip()[-3:] == 'YES':\n";
                };

                Blockly.Python.forBlock['extract_temperature'] = function (block) {
                    return "        temp_str = lines[1].split('t=')[-1]\n";
                };

                Blockly.Python.forBlock['convert_temperature'] = function (block) {
                    return "        return float(temp_str) / 1000.0\n";
                };

                Blockly.Python.forBlock['while_true_loop'] = function (block) {
                    return 'while True:\n';
                };

                Blockly.Python.forBlock['call_read_temp'] = function (block) {
                    return '    temp = read_temp()\n';
                };

                Blockly.Python.forBlock['print_temperature'] = function (block) {
                    return '    print(f"Temperature: {temp:.2f}°C")\n';
                };

                Blockly.Python.forBlock['sleep_delay'] = function (block) {
                    return '    time.sleep(1)\n';
                };

                console.log('✅ forBlock generators setup complete - Enhanced compatibility enabled');
            }
        } catch (error) {
            console.error('Error setting up forBlock generators:', error);
        }

        console.log('DS18B20 custom blocks setup complete with dual method support');

    } catch (error) {
        console.error('Error setting up custom blocks:', error);
    }
}

// Enhanced Python code simulator for DS18B20
function simulatePythonExecution(code) {
    const outputElement = document.getElementById('executionOutput');
    const statusIndicator = document.getElementById('statusIndicator');

    statusIndicator.className = 'status-indicator status-running';
    outputElement.textContent = '📡 Fetching real DS18B20 temperature data...\n';

    fetch('/api/ds18b20/live')
        .then(response => response.json())
        .then(sensorData => {
            const temperature = sensorData.ds18b20_temp?.toFixed(2) || 'N/A';
            const timestamp = sensorData.timestamp || 'Unknown';

            let output = '';
            output += `✅ import os\n`;
            output += `✅ import glob\n`;
            output += `✅ import time\n`;
            output += `✅ base_dir = '/sys/bus/w1/devices/'\n`;
            output += `✅ device_folder = glob.glob(base_dir + '28*')[0]\n`;
            output += `✅ device_file = device_folder + '/w1_slave'\n`;
            output += `✅ def read_temp():\n`;
            output += `  └─ 🔧 Defined function to read DS18B20 temperature\n`;
            output += `✅ temp = read_temp()\n`;
            output += `  └─ 📊 Temperature reading: ${temperature}°C\n`;
            output += `📺 Temperature: ${temperature}°C\n`;
            output += `🕒 Timestamp: ${timestamp}\n`;
            output += '\n🎉 Real sensor data execution complete!';

            outputElement.textContent = output;
            statusIndicator.className = 'status-indicator status-ready';
        })
        .catch(error => {
            const errorOutput = `❌ Failed to fetch DS18B20 data:\n${error.message}`;
            outputElement.textContent = errorOutput;
            statusIndicator.className = 'status-indicator status-error';
        });
}


// Initialize everything
function initializeEverything() {
    console.log('Starting DS18B20 initialization...');

    if (typeof Blockly === 'undefined' || typeof Blockly.Python === 'undefined') {
        console.error('Blockly or Blockly.Python not available');
        document.getElementById('output').innerHTML = '<span style="color: red;">Blockly not properly loaded</span>';
        return;
    }

    setupCustomBlocks();

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

        console.log('DS18B20 workspace created successfully');

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
            document.getElementById('output').textContent = '# No blocks in workspace\n# Drag blocks from the toolbox to generate DS18B20 code\n# Use "Complete DS18B20 Code" for a full example';
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

    document.getElementById('executionOutput').textContent = '🚀 Starting DS18B20 code simulation...\n\n📝 Note: This simulates DS18B20 sensor readings since we cannot access actual hardware in a browser environment.';
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

function loadExample() {
    if (!workspace) return;

    workspace.clear();

    const xmlText = `
  <xml xmlns="https://developers.google.com/blockly/xml">
    <block type="complete_ds18b20_code" x="50" y="50"></block>
  </xml>`;

    try {
        const xml = Blockly.Xml.textToDom(xmlText);
        Blockly.Xml.domToWorkspace(xml, workspace);
        generateCode();
    } catch (error) {
        console.error('Error loading example:', error);
    }
}

function clearWorkspace() {
    if (workspace) {
        workspace.clear();
        document.getElementById('output').textContent = 'Click "Generate Python Code" to see the result...';
        document.getElementById('executionOutput').textContent = 'Click "Simulate Execution" to run the generated Python code...';
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
    console.log('Page loaded, initializing in 500ms...');
    setTimeout(initializeEverything, 500);
});

// Add some debugging
window.addEventListener('error', function (e) {
    console.error('Global error:', e.error);
});
