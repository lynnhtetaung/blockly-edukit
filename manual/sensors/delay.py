import time
import RPi.GPIO as GPIO
import adafruit_dht
from w1thermsensor import W1ThermSensor

# GPIO PIN ASSIGNMENTS
DHT_PIN = 17
WATER_LEVEL_PIN = 27
RELAY_PIN = 22

# SETUP
GPIO.setmode(GPIO.BCM)
GPIO.setup(WATER_LEVEL_PIN, GPIO.IN)
GPIO.setup(RELAY_PIN, GPIO.OUT)
GPIO.output(RELAY_PIN, GPIO.HIGH)  # Relay OFF (assuming active-low)

dht_sensor = adafruit_dht.DHT22(DHT_PIN)
ds18b20_sensor = W1ThermSensor()

# Thresholds
WATER_TEMP_LOW = 24.0
WATER_LEVEL_LOW = 0  # assuming 0 = dry
AIR_TEMP_HIGH = 35.0

try:
    while True:
        # Read DS18B20
        water_temp = ds18b20_sensor.get_temperature()

        # Read DHT22
        try:
            air_temp = dht_sensor.temperature
            humidity = dht_sensor.humidity
        except RuntimeError:
            air_temp, humidity = None, None

        # Read water level
        water_present = GPIO.input(WATER_LEVEL_PIN)  # 1 = water, 0 = dry

        print("\n=== SENSOR READINGS ===")
        print(f"Water Temp: {water_temp:.2f} °C")
        print(f"Air Temp: {air_temp} °C, Humidity: {humidity}%")
        print(f"Water Level: {'OK' if water_present else 'LOW'}")

        # Relay Logic Example
        if water_temp < WATER_TEMP_LOW or not water_present:
            print("Relay ON: heating or pumping")
            GPIO.output(RELAY_PIN, GPIO.LOW)
        elif air_temp is not None and air_temp > AIR_TEMP_HIGH:
            print("Relay ON: high air temp")
            GPIO.output(RELAY_PIN, GPIO.LOW)
        else:
            print("Relay OFF")
            GPIO.output(RELAY_PIN, GPIO.HIGH)

        time.sleep(5)

except KeyboardInterrupt:
    pass
finally:
    GPIO.output(RELAY_PIN, GPIO.HIGH)
    GPIO.cleanup()
