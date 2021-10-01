const express = require('express');
const ArduinoController = require('../Controller/ArduinoController');
const router = express.Router();

router.get('/get-data', ArduinoController.getData);

module.exports = router;