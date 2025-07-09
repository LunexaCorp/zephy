# 🌱 Proyecto Ecoroute

Ecoroute es una plataforma de monitoreo ambiental urbano basada en IoT (Internet de las Cosas), desarrollada para evaluar y visualizar en tiempo real la calidad del ambiente en distintos puntos estratégicos de Puerto Maldonado / Tambopata.

El proyecto busca fomentar la conciencia ambiental y ofrecer a los ciudadanos información útil para decidir si es conveniente visitar ciertos lugares de la ciudad, además de brindar acceso a datos detallados para usuarios más técnicos.

### 📍 ¿Qué hace Ecoroute?
- Se instalan módulos ESP32 en ubicaciones estratégicas (Plaza de Armas, Plaza Bolognesi, etc.).

- Cada módulo recopila datos de sensores ambientales.

- Los datos se transmiten vía red a un servidor central.

- La información se muestra en una interfaz web interactiva.

## 🧩 Componentes utilizados

### 🔌 Dispositivo base
ESP32S 38P NodeMCU (USB Tipo C)
Microcontrolador principal con conectividad WiFi para transmitir datos desde los sensores.

### 🌡️ Sensores ambientales disponibles (Temporal)
| Sensor     | Función                                                                                        | Relevancia                                                                           |
|------------|------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------|
| **MQ135**  | Detección de calidad del aire: gases como amoníaco, dióxido de carbono, alcohol, benceno, etc. | Principal indicador de calidad del aire                                              |
| **DHT11**  | Sensor de temperatura y humedad                                                                | Ayuda a contextualizar el entorno                                                    |
| **KY-037** | Sensor de sonido                                                                               | Mide niveles de ruido ambiental                                  |
| **BH1750** | Sensor de intensidad lumínica (lux)                                                            | Evalúa luminosidad del lugar, útil para predicciones de visibilidad                  |
| **HC-SR04**| Sensor ultrasónico de distancia                                                                | Para proyectos futuros relacionados con flujo de personas                  |


## 🖥️ Tecnologías usadas

| Área                          | Tecnología                          |
|-------------------------------|-------------------------------------|
| **Frontend**                  | React + TailwindCSS                 |
| **Backend**                   | Node.js (Express)                   |
| **Base de datos**             | MongoDB                             |
| **IoT**                       | ESP32, sensores varios              |
| **Protocolo de comunicación** | HTTP / MQTT (Aún planeandose)       |


## 📊 Visualización de datos
La interfaz web incluye:

- Estado ambiental en tiempo real por ubicación

- Recomendaciones (¿Es buena idea ir?)

- Gráficas históricas de temperatura, humedad y calidad del aire

- Sección técnica para usuarios avanzados (datos crudos, exportación, etc.)

## 🧠 Futuras implementaciones

### 🔮 Series Temporales & LSTM
Queremos aplicar modelos de predicción basados en LSTM (Long Short-Term Memory) para:

- Anticipar picos de contaminación

- Generar alertas tempranas

- Analizar patrones a lo largo del día o semana

### 🧪 Análisis de gases específicos
Sensores como el MQ135 permiten detectar gases como:

- Metano (CH₄)

- Monóxido de carbono (CO)

- Dióxido de carbono (CO₂)

La idea es ofrecer información sobre estos contaminantes de forma clara para la ciudadanía, y más detallada para investigadores o tomadores de decisiones.

### 📌 Notas adicionales
- El sistema está diseñado para ser escalable. Se pueden agregar nuevos puntos de monitoreo fácilmente.

- En futuras versiones se planea usar MQTT para mejorar eficiencia de transmisión.

- El sistema considera la privacidad de los usuarios. No se recopilan datos personales.
