from flask import Flask, render_template, request, jsonify
import csv
import time
import os
import board
import adafruit_dht
import glob
import RPi.GPIO as GPIO

app = Flask(__name__)

latest_sensor_data = {
    "ds18b20": None,
    "dht22_temp": None,
    "dht22_humidity": None,
    "water_level": None,
    "timestamp": None
}

CSV_FILE = 'sensor_log.csv'


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/scenario1')
def scenario1():
    return render_template('scenario1/home.html')

@app.route('/scenario1_lesson1')
def scenario1_lesson1():
    return render_template('scenario1/lesson1.html')

@app.route('/scenario1_lesson2')
def scenario1_lesson2():
    return render_template('scenario1/lesson2.html')

@app.route('/scenario1_lesson3')
def scenario1_lesson3():
    return render_template('scenario1/lesson3.html')

@app.route('/scenario2')
def scenario2():
    return render_template('scenario2/home.html')

@app.route('/scenario2_lesson1')
def scenario2_lesson1():
    return render_template('scenario2/lesson1.html')

@app.route('/scenario2_lesson2')
def scenario2_lesson2():
    return render_template('scenario2/lesson2.html')

@app.route('/scenario2_lesson3')
def scenario2_lesson3():
    return render_template('scenario2/lesson3.html')

@app.route('/scenario3')
def scenario3():
    return render_template('scenario3/home.html')

@app.route('/scenario3_lesson1')
def scenario3_lesson1():
    return render_template('scenario3/lesson1.html')

@app.route('/scenario3_lesson2')
def scenario3_lesson2():
    return render_template('scenario3/lesson2.html')

@app.route('/scenario3_lesson3')
def scenario3_lesson3():
    return render_template('scenario3/lesson3.html')

@app.route('/api/dht22/live')
def get_live_dht22():
    try:
        dhtDevice = adafruit_dht.DHT22(board.D13, use_pulseio=False)
        temperature = dhtDevice.temperature
        timestamp = time.strftime('%Y-%m-%d %H:%M:%S')

        return jsonify({
            "dht22_temp": temperature,
            "timestamp": timestamp
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/api/ds18b20/live')
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

        return jsonify({
            "ds18b20_temp": temp_c,
            "timestamp": time.strftime('%Y-%m-%d %H:%M:%S')
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/water_sensor/live')
def get_live_water_sensor():
    try:
        GPIO.setwarnings(False)
        GPIO.setmode(GPIO.BCM)
        sensor_pin = 17  # Or the correct GPIO pin

        GPIO.setup(sensor_pin, GPIO.IN)
        water_detected = GPIO.input(sensor_pin) == GPIO.LOW  # LOW means water detected

        return jsonify({
            "water_detected": water_detected,
            "timestamp": time.strftime('%Y-%m-%d %H:%M:%S')
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# This is for arduino connection
# @app.route('/arduino_data')
# def ardunio_data():
#     return render_template('arduino-data.html', data=latest_sensor_data)

# @app.route('/api/sensor', methods=['POST'])
# def receive_sensor_data():
#     global latest_sensor_data
#     try:
#         data = request.get_json()
#         data["timestamp"] = time.strftime('%Y-%m-%d %H:%M:%S')
#         latest_sensor_data = data
#         print("📥 Received:", data)
        
#         # Save to CSV
#         write_to_csv(data)
        
#         return jsonify({"status": "success"}), 200
#     except Exception as e:
#         return jsonify({"status": "error", "message": str(e)}), 400

# @app.route('/api/latest')
# def get_latest():
#     return jsonify(latest_sensor_data)

# def write_to_csv(data):
#     file_exists = os.path.isfile(CSV_FILE)
#     with open(CSV_FILE, 'a', newline='') as csvfile:
#         fieldnames = ['timestamp', 'ds18b20', 'dht22_temp', 'dht22_humidity', 'water_level']
#         writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

#         if not file_exists:
#             writer.writeheader()

#         writer.writerow({
#             'timestamp': data['timestamp'],
#             'ds18b20': data['ds18b20'],
#             'dht22_temp': data['dht22_temp'],
#             'dht22_humidity': data['dht22_humidity'],
#             'water_level': data['water_level']
#         })


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
