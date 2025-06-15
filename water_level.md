# 💧 Water Level Sensor with Raspberry Pi and MCP3008

This guide walks you through connecting and reading an **analog water level sensor** using a **Raspberry Pi** and an **MCP3008 ADC**.

---

## 🧰 Hardware Requirements

- Raspberry Pi (any model)
- MCP3008 Analog-to-Digital Converter (ADC)
- Water Level Sensor (analog type, e.g., HL-83)
- Jumper wires + Breadboard
- 4.7kΩ or 10kΩ pull-up resistor (if needed)

---

## ⚡ Wiring Guide

| MCP3008 Pin | Connects To (Raspberry Pi) |
|-------------|----------------------------|
| VDD, VREF   | 3.3V                       |
| AGND, DGND  | GND                        |
| CLK         | GPIO11 (SCLK, Pin 23)     |
| DOUT        | GPIO9  (MISO, Pin 21)     |
| DIN         | GPIO10 (MOSI, Pin 19)     |
| CS/SHDN     | GPIO8  (CE0, Pin 24)      |
| CH0         | Signal pin from sensor    |

> Connect the sensor's VCC to 3.3V (or 5V), GND to GND, and its analog output to MCP3008 CH0.

---

## 🔧 Software Setup

### 1. Enable SPI

```bash
sudo raspi-config
# Go to Interface Options → SPI → Enable
sudo reboot
```

2. Install Required Python Library
```bash
pip3 install spidev
```

🐍 Python Code (water_level.py)

```bash
import spidev
import time

# Initialize SPI
spi = spidev.SpiDev()
spi.open(0, 0)  # Bus 0, CE0
spi.max_speed_hz = 1350000

def read_channel(channel):
    assert 0 <= channel <= 7, "MCP3008 has 8 channels (0–7)"
    adc = spi.xfer2([1, (8 + channel) << 4, 0])
    data = ((adc[1] & 3) << 8) + adc[2]
    return data

# Main loop
try:
    while True:
        level = read_channel(0)
        voltage = level * 3.3 / 1023
        print(f"Raw Value: {level} | Voltage: {voltage:.2f} V")

        if level > 700:
            print("💧 Water Level: HIGH")
        elif level > 300:
            print("💧 Water Level: MEDIUM")
        else:
            print("💧 Water Level: LOW")

        time.sleep(1)

except KeyboardInterrupt:
    spi.close()
    print("Measurement stopped.")
```

✅ Output Example

```bash
Raw Value: 812 | Voltage: 2.62 V
💧 Water Level: HIGH
```

📌 Notes
```bash
The value ranges (LOW, MEDIUM, HIGH) are approximations. You can calibrate based on your sensor's characteristics.

Use a capacitor across VCC and GND (e.g., 100nF) for noise filtering if readings are unstable.
```

📷 Sensor Overview

```bash
Typical 3-wire analog water level sensor:

Red: VCC (3.3V or 5V)

Black: GND

Yellow: Signal (to CH0 on MCP3008)
```

📚 References

```bash
MCP3008 Datasheet

spidev PyPi

Raspberry Pi GPIO Pinout
```