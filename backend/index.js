const express = require('express');
const app = express();
require('dotenv').config();
const pc = require('picocolors');

// Evitar problemas de seguridad
app.disable('x-powered-by');

const port = process.env.PORT || env.PORT;

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


// Ruta de error 404
app.use((req, res) => {
  res.status(404).send('404 Not Found');
})

app.listen(port, () => {
  console.log(pc.blue(`Server is running on port http://localhost:${port}`));
});
