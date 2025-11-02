/**
 * Sensor Data Routes
 * 
 * Handles all endpoints related to sensor data
 */

const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController');
const { verifyApiKey } = require('../middleware/auth');

// POST - Receive data from ESP32
router.post('/', verifyApiKey, sensorController.receiveSensorData);

// GET - Retrieve latest sensor data
router.get('/latest', sensorController.getLatestData);

// GET - Retrieve historical data with filters
router.get('/history', sensorController.getHistoricalData);

// GET - Get data for specific device
router.get('/device/:deviceId', sensorController.getDeviceData);

// GET - Get statistics
router.get('/stats', sensorController.getStatistics);

// DELETE - Clear old data (admin only)
router.delete('/cleanup', sensorController.cleanupOldData);

module.exports = router;
