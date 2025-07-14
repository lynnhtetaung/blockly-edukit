import time
import RPi.GPIO as GPIO
from w1thermsensor import W1ThermSensor

# === CONFIG ===
PWM_GPIO = 12           # BCM 12 = Physical Pin 32
FREQUENCY = 5000        # Hz
TEMP_THRESHOLD = 30.0   # °C
SLEEP_INTERVAL = 5      # seconds

# === SETUP ===
GPIO.setmode(GPIO.BCM)
GPIO.setup(PWM_GPIO, GPIO.OUT)

pwm = GPIO.PWM(PWM_GPIO, FREQUENCY)
pwm.start(0)  # Start with PWM OFF

sensor = W1ThermSensor()

print("📡 Monitoring temperature with DS18B20 to control PWM on GPIO12...")

try:
    while True:
        temp = sensor.get_temperature()
        print(f"🌡 Water Temp: {temp:.2f} °C")

        if temp < TEMP_THRESHOLD:
            print("🔥 Temp below threshold — turning PWM ON (100%)")
            pwm.ChangeDutyCycle(100)
        else:
            print("❄️ Temp above threshold — turning PWM OFF (0%)")
            pwm.ChangeDutyCycle(0)

        time.sleep(SLEEP_INTERVAL)

except KeyboardInterrupt:
    print("Interrupted by user. Stopping...")

finally:
    pwm.stop()
    GPIO.cleanup()
    print("🧹 GPIO cleaned up. PWM stopped.")
