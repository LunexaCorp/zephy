// index.js
const express = require('express');
const app = express();
const sensoresRoutes = require('./routes/sensores');

app.use(express.json());
app.use('/api/sensores', sensoresRoutes);

app.get('/', (req, res) => {
  res.send('🟢 Ecoroute backend corriendo desde Docker');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

