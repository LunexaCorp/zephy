export const mqttConfig = {
  broker: {
    url: process.env.MQTT_BROKER_URL,
    port: parseInt(process.env.MQTT_BROKER_PORT) || 8883,
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    protocol: "mqtts"
  },
  connection: {
    reconnectPeriod: 5000,
    connectTimeout: 30000,
    clean: true
  },
  buffer: {
    timeoutMs: 60000
  }
};

export const topicToFieldMap = {
  'airquality': 'airQuality',
  'temperature': 'temperature',
  'humidity': 'humidity'
};
