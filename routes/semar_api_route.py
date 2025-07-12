from flask import Blueprint, jsonify
import board
import adafruit_dht
import RPi.GPIO as GPIO
import requests
import glob
from datetime import datetime, timezone

semar_bp = Blueprint('semar', __name__)

# Global constants for SEMAR API
SEMAR_URL = "http://192.168.0.211:8001/api/v1/sensors/"
SEMAR_HEADERS = {
    "Content-Type": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3JfaWQiOiI2NzdlMTU1NTlhYTU1NzFmM2NmYmM0MWIiLCJ1c2VybmFtZSI6ImFkbWluIiwiZGV2X2lkIjoiNjg3MTQ5MjVmZGRmZTQ0NjI1M2I4NjQzIiwiZGV2X2NvZGUiOiJnc2lmOHQiLCJleHAiOjE3NTIyOTc5NTd9.cr8hS61QXRYYjrjFB-vObwExkrkmxN76ERgQ-jyspXg"
}
SEMAR_DEVICE_CODE = "q1afo2"
SEMAR_DEVICE_ID = "68714b5323471da8dda851c2"

def build_payload(data_dict):
    return {
        "device_code": SEMAR_DEVICE_CODE,
        "device_id": SEMAR_DEVICE_ID,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "data": data_dict
    }

@semar_bp.route('/api/semar/dht22', methods=['POST'])
def send_dht22():
    try:
        dhtDevice = adafruit_dht.DHT22(board.D13, use_pulseio=False)
        temp = round(dhtDevice.temperature, 2)
        payload = build_payload({"temperature": temp})
        res = requests.post(SEMAR_URL, json=payload, headers=SEMAR_HEADERS)
        return jsonify({"status": res.status_code, "response": res.text, "payload": payload})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@semar_bp.route('/api/semar/ds18b20', methods=['POST'])
def send_ds18b20():
    try:
        base_dir = '/sys/bus/w1/devices/'
        device_folder = glob.glob(base_dir + '28*')[0]
        device_file = device_folder + '/w1_slave'
        with open(device_file, 'r') as f:
            lines = f.readlines()
        if lines[0].strip()[-3:] == 'YES':
            temp_str = lines[1].split('t=')[-1]
            temp = round(float(temp_str) / 1000.0, 2)
        else:
            temp = None
        payload = build_payload({"ds18b20_temp": temp})
        res = requests.post(SEMAR_URL, json=payload, headers=SEMAR_HEADERS)
        return jsonify({"status": res.status_code, "response": res.text, "payload": payload})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@semar_bp.route('/api/semar/water', methods=['POST'])
def send_water_sensor():
    try:
        sensor_pin = 17
        GPIO.setwarnings(False)
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(sensor_pin, GPIO.IN)
        water_detected = GPIO.input(sensor_pin) == GPIO.LOW
        payload = build_payload({"water_detected": water_detected})
        res = requests.post(SEMAR_URL, json=payload, headers=SEMAR_HEADERS)
        return jsonify({"status": res.status_code, "response": res.text, "payload": payload})
    except Exception as e:
        return jsonify({"error": str(e)}), 500