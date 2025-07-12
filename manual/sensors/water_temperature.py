import glob
import time
import sys

device_files = glob.glob('/sys/bus/w1/devices/28*/w1_slave')
if not device_files:
    print("No DS18B20 sensor found! Check wiring and 1-Wire config.")
    sys.exit(1)

device_file = device_files[0]

def read_temp():
    with open(device_file, 'r') as f:
        lines = f.readlines()
    if lines[0].strip()[-3:] == 'YES':
        temp_str = lines[1].split('t=')[-1]
        return float(temp_str) / 1000.0

while True:
    temp = read_temp()
    print(f"Water Temperature: {temp:.2f}°C")
    time.sleep(1)