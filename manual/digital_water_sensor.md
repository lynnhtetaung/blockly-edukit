The Keyestudio Water Sensor you're using is a digital water detection sensor, not an analog one. It typically has 3 pins labeled:

Label	Description
S	Signal (Digital OUT)
+	VCC (Power)
–	GND

✅ What This Means
The sensor outputs HIGH (1) when no water is detected, and LOW (0) when water is present.

It can be connected directly to a GPIO pin (no MCP3008 needed).

# 🧰 Setup Instructions (Keyestudio Water Sensor → Raspberry Pi 4)
Sensor Pin	Connect To Raspberry Pi
S (Signal)	GPIO17 (Pin 11)
+ (VCC)	3.3V (Pin 1)
– (GND)	GND (Pin 6)

✅ You can use any GPIO, but this code example uses GPIO17.

# 🐍 Python Code Example (digital_water_sensor.py)

bash```
import RPi.GPIO as GPIO
import time

# Use BCM pin numbering
GPIO.setmode(GPIO.BCM)

# Set the GPIO pin connected to the signal pin of the sensor
WATER_SENSOR_PIN = 17

# Set pin as input
GPIO.setup(WATER_SENSOR_PIN, GPIO.IN)

print("🌊 Monitoring water level (CTRL+C to stop)...")

try:
    while True:
        if GPIO.input(WATER_SENSOR_PIN) == GPIO.LOW:
            print("💧 Water detected!")
        else:
            print("⚠️ No water detected.")
        time.sleep(1)

except KeyboardInterrupt:
    print("\nStopped by user.")
    GPIO.cleanup()
```