// routes/sensores.js
const express = require('express');
const router = express.Router();
const { getDatosSensores } = require('../controllers/sensoresController');

router.get('/', getDatosSensores);

module.exports = router;
