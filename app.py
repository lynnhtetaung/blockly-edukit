from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/scenario1')
def dht22_temperature():
    return render_template('scenario1.html')

@app.route('/scenario2')
def dht22_humidity():
    return render_template('scenario2.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
