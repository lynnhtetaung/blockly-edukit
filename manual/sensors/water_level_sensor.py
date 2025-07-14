import RPi.GPIO as GPIO
import time

# Use BCM pin numbering
GPIO.setmode(GPIO.BCM)

# Set the GPIO pin connected to the signal pin of the sensor
WATER_SENSOR_PIN = 17

# Set pin as input
GPIO.setup(WATER_SENSOR_PIN, GPIO.IN)

# Many digital water sensors output LOW when water is present.
# But some do the opposite — output HIGH when wet.
if GPIO.input(WATER_SENSOR_PIN) == GPIO.HIGH:
    print("💧 Water detected!")
else:
    print("⚠️ No water detected.")

