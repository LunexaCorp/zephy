// controllers/sensoresController.js
const getDatosSensores = (req, res) => {
  res.json({
    temperatura: 26.5,
    humedad: 70,
    ruido: 45,
    calidad_aire: "Buena"
  });
};

module.exports = {
  getDatosSensores
};
