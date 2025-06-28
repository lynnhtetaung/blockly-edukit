# DS18B20 Water Temperature Sensor with Raspberry Pi 5

This guide details how to set up and read data from a DS18B20 waterproof temperature sensor using Python on a Raspberry Pi 5.

## 🧰 Requirements

* **Raspberry Pi 5** (with Raspberry Pi OS installed)
* **DS18B20 waterproof temperature sensor**
* **4.7kΩ pull-up resistor** (connect between the data line and 3.3V)

---

## ⚡️ Wiring Instructions

Connect the DS18B20 sensor to your Raspberry Pi 5 as follows:

* **Red wire** (VCC) → Raspberry Pi **3.3V** pin
* **Black wire** (GND) → Raspberry Pi **GND** pin
* **Yellow wire** (Data) → Raspberry Pi **GPIO4** (this is the default 1-Wire pin)

---

## ⚙️ Setup

### 📁 Step 1: Enable 1-Wire Interface

You need to enable the 1-Wire interface in your Raspberry Pi's configuration.

1.  Open the configuration file:

    ```bash
    sudo nano /boot/config.txt
    ```

2.  Add the following line at the end of the file (if it's not already there):

    ```
    dtoverlay=w1-gpio
    ```

3.  Save the file by pressing `Ctrl+X`, then `Y`, then `Enter`.

4.  Reboot your Raspberry Pi for the changes to take effect:

    ```bash
    sudo reboot
    ```

### 📁 Step 2: Load 1-Wire Kernel Modules

The 1-Wire kernel modules should typically load automatically after rebooting with the `dtoverlay` enabled. However, if you encounter issues, you can manually load them:

```bash
sudo modprobe w1-gpio
sudo modprobe w1-therm      
```
### 📁 Step 3: Check if Sensor is Detected
```bash
Run:
ls /sys/bus/w1/devices/
You should see something like: 28-xxxxxxxxxxxx
```
### 📁 Step 4: Python Code to Read Temperature

```bash
import glob
import time

device_file = glob.glob('/sys/bus/w1/devices/28*/w1_slave')[0]

def read_temp():
    with open(device_file, 'r') as f:
        lines = f.readlines()
    if lines[0].strip()[-3:] == 'YES':
        temp_str = lines[1].split('t=')[-1]
        return float(temp_str) / 1000.0

while True:
    temp = read_temp()
    print(f"Temperature: {temp:.2f}°C")
    time.sleep(1)
```