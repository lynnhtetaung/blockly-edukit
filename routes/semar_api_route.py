from flask import Blueprint, jsonify
import board
import adafruit_dht
import RPi.GPIO as GPIO
import requests
import glob
from datetime import datetime, timezone

semar_bp = Blueprint('semar', __name__)

# Device credentials for each sensor
DHT22_DEVICE = {
    "code": "lcuccf",
    "id": "6874bd5ad0778e63946090a8",
    "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3JfaWQiOiI2NzdlMTU1NTlhYTU1NzFmM2NmYmM0MWIiLCJ1c2VybmFtZSI6ImFkbWluIiwiZGV2X2lkIjoiNjg3NGJkNWFkMDc3OGU2Mzk0NjA5MGE4IiwiZGV2X2NvZGUiOiJsY3VjY2YiLCJleHAiOjE3NTI1MjQzMTR9._QlykM75TXwNGbGvCjv3UlsfS_PsIFQpMVi2ujO_Bv4"
}
DS18B20_DEVICE = {
    "code": "fzh3rz",
    "id": "6874b9cf23471da8dda851c7",
    "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3JfaWQiOiI2NzdlMTU1NTlhYTU1NzFmM2NmYmM0MWIiLCJ1c2VybmFtZSI6ImFkbWluIiwiZGV2X2lkIjoiNjg3NGI5Y2YyMzQ3MWRhOGRkYTg1MWM3IiwiZGV2X2NvZGUiOiJmemgzcnoiLCJleHAiOjE3NTI1MjM0MDd9.DwOZCF3w3W5c8gya3x1MucAhHXKnKvhrnn7RkOAHB0Q"
}
WATER_LEVEL_DEVICE = {
    "code": "z4icno",
    "id": "6874be9bd0778e63946090aa",
    "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3JfaWQiOiI2NzdlMTU1NTlhYTU1NzFmM2NmYmM0MWIiLCJ1c2VybmFtZSI6ImFkbWluIiwiZGV2X2lkIjoiNjg3NGJlOWJkMDc3OGU2Mzk0NjA5MGFhIiwiZGV2X2NvZGUiOiJ6NGljbm8iLCJleHAiOjE3NTI1MjQ2MzV9.QGf80fjhucCLxIZ7sv-pzH5e_JC8Y8jmaec6E-9As2A"
}

SEMAR_URL = "http://192.168.0.211:8001/api/v1/sensors/"

def build_payload(data_dict, device):
    return {
        "device_code": device["code"],
        "device_id": device["id"],
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "data": data_dict
    }

def build_headers(device):
    return {
        "Content-Type": "application/json",
        "Authorization": device["token"]
    }

@semar_bp.route('/api/semar/dht22', methods=['POST'])
def send_dht22():
    try:
        dhtDevice = adafruit_dht.DHT22(board.D13, use_pulseio=False)
        temp = round(dhtDevice.temperature, 2)
        payload = build_payload({"room_temperature": temp}, DHT22_DEVICE)
        headers = build_headers(DHT22_DEVICE)
        res = requests.post(SEMAR_URL, json=payload, headers=headers)
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
        payload = build_payload({"water_temperature": temp}, DS18B20_DEVICE)
        headers = build_headers(DS18B20_DEVICE)
        res = requests.post(SEMAR_URL, json=payload, headers=headers)
        return jsonify({"status": res.status_code, "response": res.text, "payload": payload})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@semar_bp.route('/api/semar/water_level', methods=['POST'])
def send_water_sensor():
    try:
        sensor_pin = 17
        GPIO.setwarnings(False)
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(sensor_pin, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)

        if GPIO.input(sensor_pin) == GPIO.HIGH:
            water_status = "Water detected"
        else:
            water_status = "No water detected"

        payload = build_payload({"water_level": water_status}, WATER_LEVEL_DEVICE)
        headers = build_headers(WATER_LEVEL_DEVICE)
        res = requests.post(SEMAR_URL, json=payload, headers=headers)

        return jsonify({
            "status": res.status_code,
            "response": res.text,
            "payload": payload
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
