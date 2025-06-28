from flask import Flask, render_template, request, jsonify
import csv
import time
import os

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

@app.route('/arduino_data')
def ardunio_data():
    return render_template('arduino-data.html', data=latest_sensor_data)

@app.route('/api/sensor', methods=['POST'])
def receive_sensor_data():
    global latest_sensor_data
    try:
        data = request.get_json()
        data["timestamp"] = time.strftime('%Y-%m-%d %H:%M:%S')
        latest_sensor_data = data
        print("📥 Received:", data)
        
        # Save to CSV
        write_to_csv(data)
        
        return jsonify({"status": "success"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400

@app.route('/api/latest')
def get_latest():
    return jsonify(latest_sensor_data)

def write_to_csv(data):
    file_exists = os.path.isfile(CSV_FILE)
    with open(CSV_FILE, 'a', newline='') as csvfile:
        fieldnames = ['timestamp', 'ds18b20', 'dht22_temp', 'dht22_humidity', 'water_level']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        if not file_exists:
            writer.writeheader()

        writer.writerow({
            'timestamp': data['timestamp'],
            'ds18b20': data['ds18b20'],
            'dht22_temp': data['dht22_temp'],
            'dht22_humidity': data['dht22_humidity'],
            'water_level': data['water_level']
        })


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
