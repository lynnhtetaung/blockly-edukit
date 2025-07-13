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