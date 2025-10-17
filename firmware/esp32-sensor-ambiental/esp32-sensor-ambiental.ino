#include "config.h"

/************************ Configuración ***************************/
#define DHTPIN              4
#define DHTTYPE             DHT11
#define MQ135PIN            34

/************************ Librerías **************************************/
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include "DHT.h"

/************************ Clase WiFiManager ******************************/
class WiFiManager {
private:
    const char* ssid;
    const char* password;

public:
    WiFiManager(const char* ssid, const char* pass)
        : ssid(ssid), password(pass) {}

    void connect() {
        Serial.print("Conectando a WiFi: ");
        Serial.println(ssid);
        WiFi.begin(ssid, password);

        while (WiFi.status() != WL_CONNECTED) {
            delay(1000);
            Serial.print(".");
        }

        Serial.println("\nConectado a WiFi!");
        Serial.print("IP: ");
        Serial.println(WiFi.localIP());
    }

    bool isConnected() {
        return WiFi.status() == WL_CONNECTED;
    }

    void checkConnection() {
        if (!isConnected()) {
            Serial.println("⚠️ WiFi desconectado, reconectando...");
            connect();
        }
    }
};

/************************ Clase MQTTManager ******************************/
class MQTTManager {
private:
    PubSubClient* client;
    const char* server;
    int port;
    const char* user;
    const char* password;
    const char* clientId;

public:
    MQTTManager(WiFiClientSecure& espClient, const char* srv, int prt,
                const char* usr, const char* pass, const char* id)
        : server(srv), port(prt), user(usr), password(pass), clientId(id) {
        client = new PubSubClient(espClient);
        client->setServer(server, port);
    }

    void connect() {
        while (!client->connected()) {
            Serial.print("Conectando a MQTT...");
            if (client->connect(clientId, user, password)) {
                Serial.println("✅ Conectado!");
            } else {
                Serial.print("Error rc=");
                Serial.print(client->state());
                Serial.println(" Reintentando en 5s...");
                delay(5000);
            }
        }
    }

    bool isConnected() {
        return client->connected();
    }

    void loop() {
        client->loop();
    }

    bool publish(const String& topic, const String& payload) {
        return client->publish(topic.c_str(), payload.c_str());
    }

    ~MQTTManager() {
        delete client;
    }
};

/************************ Clase SensorDHT ******************************/
class SensorDHT {
private:
    DHT dht;
    float lastTemperature;
    float lastHumidity;
    bool lastReadValid;

public:
    SensorDHT(uint8_t pin, uint8_t type)
        : dht(pin, type), lastTemperature(0), lastHumidity(0), lastReadValid(false) {}

    void begin() {
        dht.begin();
    }

    bool read() {
        lastHumidity = dht.readHumidity();
        lastTemperature = dht.readTemperature();
        lastReadValid = !isnan(lastHumidity) && !isnan(lastTemperature);

        if (!lastReadValid) {
            Serial.println("⚠️ Error leyendo DHT11");
        }

        return lastReadValid;
    }

    float getTemperature() const { return lastTemperature; }
    float getHumidity() const { return lastHumidity; }
    bool isValid() const { return lastReadValid; }

    void printData() const {
        if (lastReadValid) {
            Serial.print("  Temperatura: ");
            Serial.print(lastTemperature, 1);
            Serial.println(" °C");

            Serial.print("  Humedad: ");
            Serial.print(lastHumidity, 1);
            Serial.println(" %");
        }
    }
};

/************************ Clase SensorMQ135 ******************************/
class SensorMQ135 {
private:
    uint8_t pin;
    float lastReading;
    const int samples = 10;

public:
    SensorMQ135(uint8_t analogPin)
        : pin(analogPin), lastReading(0) {}

    bool read() {
        int adcSum = 0;

        for(int i = 0; i < samples; i++) {
            adcSum += analogRead(pin);
            delay(10);
        }

        lastReading = adcSum / float(samples);

        if (lastReading < 0) {
            Serial.println("⚠️ Error leyendo MQ135");
            return false;
        }

        return true;
    }

    float getADCValue() const { return lastReading; }

    void printData() const {
        Serial.print("💨 ADC MQ135: ");
        Serial.print(lastReading, 0);
        Serial.println(" (0-4095)");
    }
};

/************************ Clase IoTSystem ******************************/
class IoTSystem {
private:
    WiFiManager* wifiManager;
    MQTTManager* mqttManager;
    SensorDHT* dhtSensor;
    SensorMQ135* mq135Sensor;
    String location;
    unsigned long lastSend;
    unsigned long interval;

public:
    IoTSystem(const String& loc, unsigned long sendInterval = 60000)
        : location(loc), lastSend(0), interval(sendInterval) {}

    void setupWiFi(const char* ssid, const char* pass) {
        wifiManager = new WiFiManager(ssid, pass);
        wifiManager->connect();
    }

    void setupMQTT(WiFiClientSecure& espClient, const char* server, int port,
                   const char* user, const char* pass) {
        mqttManager = new MQTTManager(espClient, server, port, user, pass,
                                      location.c_str());
        mqttManager->connect();
    }

    void setupSensors(uint8_t dhtPin, uint8_t dhtType, uint8_t mq135Pin) {
        dhtSensor = new SensorDHT(dhtPin, dhtType);
        dhtSensor->begin();

        mq135Sensor = new SensorMQ135(mq135Pin);
    }

    void update() {
        wifiManager->checkConnection();

        if (!mqttManager->isConnected()) {
            mqttManager->connect();
        }
        mqttManager->loop();

        unsigned long currentMillis = millis();
        if (currentMillis - lastSend >= interval || currentMillis < lastSend) {
            lastSend = currentMillis;
            readAndPublishData();
        }
    }

private:
    void readAndPublishData() {
        // Leer sensores
        bool dhtOk = dhtSensor->read();
        bool mq135Ok = mq135Sensor->read();

        if (!dhtOk || !mq135Ok) {
            return;
        }

        // Mostrar datos
        Serial.println("\n📡 ══════════════════════════");
        dhtSensor->printData();
        mq135Sensor->printData();
        Serial.println("══════════════════════════\n");

        // Publicar en MQTT
        mqttManager->publish(location + "/temperature",
                            String(dhtSensor->getTemperature(), 1));

        mqttManager->publish(location + "/humidity",
                            String(dhtSensor->getHumidity(), 1));

        mqttManager->publish(location + "/airquality",
                            String(mq135Sensor->getADCValue(), 0));

        Serial.println("✅ Datos publicados");
    }

public:
    ~IoTSystem() {
        delete wifiManager;
        delete mqttManager;
        delete dhtSensor;
        delete mq135Sensor;
    }
};

/************************ Instancias Globales ******************************/
WiFiClientSecure espClient;
IoTSystem* iotSystem;

/************************ Setup **************************************/
void setup() {
    Serial.begin(115200);

    // Crear sistema IoT
    iotSystem = new IoTSystem(LOCATION_NAME, 60000);

    // Configurar WiFi
    iotSystem->setupWiFi(WIFI_SSID, WIFI_PASS);

    // Configurar MQTT
    espClient.setInsecure();
    iotSystem->setupMQTT(espClient, MQTT_SERVER_HOST, MQTT_PORT,
                         MQTT_USER, MQTT_PASS);

    // Configurar sensores
    iotSystem->setupSensors(DHTPIN, DHTTYPE, MQ135PIN);

    Serial.println("🚀 Sistema iniciado");
}

/************************ Loop principal **************************************/
void loop() {
    iotSystem->update();
}
