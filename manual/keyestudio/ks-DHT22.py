import time
import board
import adafruit_dht
dhtDevice = adafruit_dht.DHT22(board.D27, use_pulseio=False)
temperature_c = dhtDevice.temperature
print(f"Temperature: {temperature_c:.1f}°C")
