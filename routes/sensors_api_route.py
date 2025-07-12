from flask import Blueprint, jsonify
import board
import adafruit_dht
import glob
import RPi.GPIO as GPIO
from datetime import datetime, time, timezone

sensors_bp = Blueprint('scenario1', __name__)

@sensors_bp.route('/api/dht22/live')
def get_live_dht22():
    try:
        dhtDevice = adafruit_dht.DHT22(board.D13, use_pulseio=False)
        temperature = dhtDevice.temperature
        timestamp = datetime.now(timezone.utc).isoformat(),
        return jsonify({"dht22_temp": temperature, "timestamp": timestamp})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@sensors_bp.route('/api/ds18b20/live')
def get_live_ds18b20():
    try:
        base_dir = '/sys/bus/w1/devices/'
        device_folder = glob.glob(base_dir + '28*')[0]
        device_file = device_folder + '/w1_slave'
        with open(device_file, 'r') as f:
            lines = f.readlines()
        if lines[0].strip()[-3:] != 'YES':
            raise Exception('CRC check failed')
        temp_str = lines[1].split('t=')[-1]
        temp_c = round(float(temp_str) / 1000.0, 2)
        return jsonify({"ds18b20_temp": temp_c, "timestamp": datetime.now(timezone.utc).isoformat(),})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@sensors_bp.route('/api/water_sensor/live')
def get_live_water_sensor():
    try:
        GPIO.setmode(GPIO.BCM)
        WATER_SENSOR_PIN = 17
        GPIO.setup(WATER_SENSOR_PIN, GPIO.IN)
        while True:
            if GPIO.input(WATER_SENSOR_PIN) == GPIO.LOW:
                water_detected = "Water detected!"
                print("💧 Water detected!")
            else:
                water_detected = "No water detected."
                print("⚠️ No water detected.")
                time.sleep(1)
            return jsonify({"water_detected": water_detected, "timestamp": datetime.now(timezone.utc).isoformat(),})
    except Exception as e:
        return jsonify({"error": str(e)}), 500