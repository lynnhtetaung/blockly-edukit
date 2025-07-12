from flask import Blueprint, jsonify, request
import time
import board
import adafruit_dht
import RPi.GPIO as GPIO
import requests
import glob
from datetime import datetime, timezone

semar_bp = Blueprint('semar', __name__)

@semar_bp.route('/api/semar/dht22', methods=['POST'])
def send_dht22():
    try:
        dhtDevice = adafruit_dht.DHT22(board.D13, use_pulseio=False)
        temp = round(dhtDevice.temperature, 2)
        url = "http://192.168.0.211:8001/api/v1/sensors/"
        payload = {
            "device_code": "q1afo2",
            "device_id": "68714b5323471da8dda851c2",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "data": {"temperature": temp}
        }
        res = requests.post(
            url,
            json=payload,
            headers={
                "Content-Type": "application/json",
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3JfaWQiOiI2NzdlMTU1NTlhYTU1NzFmM2NmYmM0MWIiLCJ1c2VybmFtZSI6ImFkbWluIiwiZGV2X2lkIjoiNjg3MTQ5MjVmZGRmZTQ0NjI1M2I4NjQzIiwiZGV2X2NvZGUiOiJnc2lmOHQiLCJleHAiOjE3NTIyOTc5NTd9.cr8hS61QXRYYjrjFB-vObwExkrkmxN76ERgQ-jyspXg"
            }
        )
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
        payload = {
            "device_code": "q1afo2",
            "device_id": "68714b5323471da8dda851c2",
            "timestamp": time.strftime('%Y-%m-%d %H:%M:%S'),
            "data": {"ds18b20_temp": temp}
        }
        res = requests.post(
            "http://192.168.0.211:8001/api/v1/sensors/",
            json=payload,
            headers={
                "Content-Type": "application/json",
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3JfaWQiOiI2NzdlMTU1NTlhYTU1NzFmM2NmYmM0MWIiLCJ1c2VybmFtZSI6ImFkbWluIiwiZGV2X2lkIjoiNjg3MTQ5MjVmZGRmZTQ0NjI1M2I4NjQzIiwiZGV2X2NvZGUiOiJnc2lmOHQiLCJleHAiOjE3NTIyOTc5NTd9.cr8hS61QXRYYjrjFB-vObwExkrkmxN76ERgQ-jyspXg"
            }
        )
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
        payload = {
            "device_code": "q1afo2",
            "device_id": "68714b5323471da8dda851c2",
            "timestamp": time.strftime('%Y-%m-%d %H:%M:%S'),
            "data": {"water_detected": water_detected}
        }
        res = requests.post(
            "http://192.168.0.211:8001/api/v1/sensors/",
            json=payload,
            headers={
                "Content-Type": "application/json",
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3JfaWQiOiI2NzdlMTU1NTlhYTU1NzFmM2NmYmM0MWIiLCJ1c2VybmFtZSI6ImFkbWluIiwiZGV2X2lkIjoiNjg3MTQ5MjVmZGRmZTQ0NjI1M2I4NjQzIiwiZGV2X2NvZGUiOiJnc2lmOHQiLCJleHAiOjE3NTIyOTc5NTd9.cr8hS61QXRYYjrjFB-vObwExkrkmxN76ERgQ-jyspXg"
            }
        )
        return jsonify({"status": res.status_code, "response": res.text, "payload": payload})
    except Exception as e:
        return jsonify({"error": str(e)}), 500