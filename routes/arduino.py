from flask import Blueprint, render_template, request, jsonify, current_app
import time
import os
import csv

arduino_bp = Blueprint('arduino', __name__)

# Use current_app to access config/global variables if needed
@arduino_bp.route('/arduino_data')
def ardunio_data():
    # You may want to store latest_sensor_data in app config or a database for production
    latest_sensor_data = current_app.config.get('LATEST_SENSOR_DATA', {
        "ds18b20": None,
        "dht22_temp": None,
        "dht22_humidity": None,
        "water_level": None,
        "timestamp": None
    })
    return render_template('arduino-data.html', data=latest_sensor_data)

@arduino_bp.route('/api/raspberry/sensor', methods=['POST'])
def receive_sensor_data():
    try:
        data = request.get_json()
        data["timestamp"] = time.strftime('%Y-%m-%d %H:%M:%S')
        # Save to app config for demo; use a database for production
        current_app.config['LATEST_SENSOR_DATA'] = data
        print("📥 Received:", data)
        write_to_csv(data)
        return jsonify({"status": "success"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400

@arduino_bp.route('/api/latest')
def get_latest():
    latest_sensor_data = current_app.config.get('LATEST_SENSOR_DATA', {
        "ds18b20": None,
        "dht22_temp": None,
        "dht22_humidity": None,
        "water_level": None,
        "timestamp": None
    })
    return jsonify(latest_sensor_data)

def write_to_csv(data):
    CSV_FILE = 'sensor_log.csv'
    file_exists = os.path.isfile(CSV_FILE)
    with open(CSV_FILE, 'a', newline='') as csvfile:
        fieldnames = ['timestamp', 'ds18b20', 'dht22_temp', 'dht22_humidity', 'water_level']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        if not file_exists:
            writer.writeheader()
        writer.writerow({
            'timestamp': data.get('timestamp'),
            'ds18b20': data.get('ds18b20'),
            'dht22_temp': data.get('dht22_temp'),
            'dht22_humidity': data.get('dht22_humidity'),
            'water_level': data.get('water_level')
        })