from flask import Flask, render_template, request, jsonify
from routes.sensors import sensors_bp
from routes.semar import semar_bp
from routes.view import view_bp
from routes.arduino import arduino_bp

app = Flask(__name__)

# Register blueprints for different routes
app.register_blueprint(view_bp)
app.register_blueprint(sensors_bp)
app.register_blueprint(semar_bp)
app.register_blueprint(arduino_bp)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
