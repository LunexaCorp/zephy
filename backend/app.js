const express = require('express');
const app = express();
require('dotenv').config();
require('./config/database');
const pc = require('picocolors');
const datosSensoriales = require('./dataTest/dispositivos.json');


// Evitar problemas de seguridad
app.disable('x-powered-by');

const port = process.env.PORT;

//-----middlewares
app.use(express.json());

app.use((req, res, next) => {
  console.log(pc.green('middleware en proceso...'));
  // trackear la request a la base de datos
  // revisar si el usuario tiene cookies
  next();
})

//-----rutas
// Ruta de inicio
app.get('/', (req, res) => {
  res.status(200).send('<h1>The server is running</h1>');
});

app.get('/dispositivos', (req, res) => {
  res.status(200).json(datosSensoriales);
});

app.get('/dispositivos/:id', (req, res) => {
  const { id } = req.params;
  const datoSensorial = datosSensoriales.find(datoSensorial =>
    datoSensorial.id === Number(id));

  if (datoSensorial) return res.json(datoSensorial);
  res.status(404).json({ error: 'No se encontró el dato sensorial' });

});


// Ruta de error 404
app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

app.listen(port, () => {
  console.log(pc.green(`Server is running on port http://localhost:${port}`));
});

