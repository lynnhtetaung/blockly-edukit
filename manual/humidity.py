import board
import adafruit_dht
dhtDevice = adafruit_dht.DHT22(board.D13, use_pulseio=False)
humidity_c = dhtDevice.humidity
print(f"Humidity: {humidity_c:.1f}°C")