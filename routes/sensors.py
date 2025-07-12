from flask import Blueprint, jsonify
import time
import board
import adafruit_dht
import glob
import RPi.GPIO as GPIO

sensors_bp = Blueprint('scenario1', __name__)

@sensors_bp.route('/api/dht22/live')
def get_live_dht22():
    try:
        dhtDevice = adafruit_dht.DHT22(board.D13, use_pulseio=False)
        temperature = dhtDevice.temperature
        timestamp = time.strftime('%Y-%m-%d %H:%M:%S')
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
        return jsonify({"ds18b20_temp": temp_c, "timestamp": time.strftime('%Y-%m-%d %H:%M:%S')})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@sensors_bp.route('/api/water_sensor/live')
def get_live_water_sensor():
    try:
        GPIO.setwarnings(False)
        GPIO.setmode(GPIO.BCM)
        sensor_pin = 17
        GPIO.setup(sensor_pin, GPIO.IN)
        water_detected = GPIO.input(sensor_pin) == GPIO.LOW
        return jsonify({"water_detected": water_detected, "timestamp": time.strftime('%Y-%m-%d %H:%M:%S')})
    except Exception as e:
        return jsonify({"error": str(e)}), 500