#include <WiFiS3.h>                 // For UNO R4 WiFi
#include <OneWire.h>
#include <DallasTemperature.h>
#include <DHT.h>

// --- WiFi Credentials ---
const char* ssid = "SPWH_L13_7A8929";
const char* pass = "6vVx6nVu";

// --- Server (RPi) IP and Port ---
const char* serverIP = "192.168.0.64"; // Replace with your RPi's IP
const int serverPort = 5000;

// --- Sensor Pins ---
#define ONE_WIRE_BUS 2
#define DHTPIN 4
#define DHTTYPE DHT22 
#define WATER_SENSOR_ANALOG_PIN A0

// --- Sensor Setup ---
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature ds18b20(&oneWire);
DHT dht(DHTPIN, DHTTYPE);

// --- WiFi client ---
WiFiClient client;

void setup() {
  Serial.begin(115200);
  dht.begin();
  ds18b20.begin();
  pinMode(WATER_SENSOR_ANALOG_PIN, INPUT);

  Serial.println("🔌 Connecting to WiFi...");
  while (WiFi.begin(ssid, pass) != WL_CONNECTED) {
    Serial.print(".");
    delay(1000);
  }

  Serial.println("\n✅ Connected to WiFi");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // --- Read Sensors ---
  ds18b20.requestTemperatures();
  float dsTemp = ds18b20.getTempCByIndex(0);
  float dhtTemp = dht.readTemperature();
  float humidity = dht.readHumidity();
  int waterLevel = analogRead(WATER_SENSOR_ANALOG_PIN);

  // --- Prepare JSON String ---
  String json = "{";
  json += "\"ds18b20\":" + String(dsTemp, 2) + ",";
  json += "\"dht22_temp\":" + String(dhtTemp, 2) + ",";
  json += "\"dht22_humidity\":" + String(humidity, 2) + ",";
  json += "\"water_level\":" + String(waterLevel);
  json += "}";

  // --- Send JSON to Raspberry Pi (Flask) ---
  if (client.connect(serverIP, serverPort)) {
    Serial.println("🌐 Connected to RPi Flask Server");
    
    client.println("POST /api/sensor HTTP/1.1");
    client.println("Host: " + String(serverIP));
    client.println("Content-Type: application/json");
    client.print("Content-Length: ");
    client.println(json.length());
    client.println(); // End headers
    client.println(json); // Send body

    delay(100);
    while (client.available()) {
      String line = client.readStringUntil('\n');
      Serial.println("📨 Response: " + line);
    }
  } else {
    Serial.println("❌ Could not connect to Flask server");
  }

  client.stop();
  delay(10000); // Wait 10 seconds before next reading
}
