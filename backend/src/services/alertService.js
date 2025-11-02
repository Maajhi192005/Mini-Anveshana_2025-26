/**
 * Alert Service
 * 
 * Handles threshold checking and alert creation
 */

const Alert = require('../models/Alert');
const AlertConfig = require('../models/AlertConfig');
const { sendTelegramAlert } = require('./telegramService');

/**
 * Check if sensor data exceeds thresholds
 */
async function checkThresholds(sensorData) {
  try {
    // Get alert configuration
    const config = await AlertConfig.findOne({ 
      deviceId: sensorData.deviceId 
    }) || await AlertConfig.findOne({ deviceId: 'default' });
    
    const thresholds = config?.thresholds || {
      temperatureHigh: parseFloat(process.env.TEMP_HIGH_THRESHOLD) || 35,
      temperatureLow: parseFloat(process.env.TEMP_LOW_THRESHOLD) || 10,
      humidityHigh: parseFloat(process.env.HUMIDITY_HIGH_THRESHOLD) || 80,
      humidityLow: parseFloat(process.env.HUMIDITY_LOW_THRESHOLD) || 20,
      motionDetection: process.env.MOTION_DETECTION !== 'false'
    };
    
    const alerts = [];
    
    // Check temperature high
    if (sensorData.temperature > thresholds.temperatureHigh) {
      const alert = await createAlert({
        deviceId: sensorData.deviceId,
        type: 'temperature_high',
        message: `Temperature is too high: ${sensorData.temperature}°C`,
        value: sensorData.temperature,
        threshold: thresholds.temperatureHigh
      });
      alerts.push(alert);
    }
    
    // Check temperature low
    if (sensorData.temperature < thresholds.temperatureLow) {
      const alert = await createAlert({
        deviceId: sensorData.deviceId,
        type: 'temperature_low',
        message: `Temperature is too low: ${sensorData.temperature}°C`,
        value: sensorData.temperature,
        threshold: thresholds.temperatureLow
      });
      alerts.push(alert);
    }
    
    // Check humidity high
    if (sensorData.humidity > thresholds.humidityHigh) {
      const alert = await createAlert({
        deviceId: sensorData.deviceId,
        type: 'humidity_high',
        message: `Humidity is too high: ${sensorData.humidity}%`,
        value: sensorData.humidity,
        threshold: thresholds.humidityHigh
      });
      alerts.push(alert);
    }
    
    // Check humidity low
    if (sensorData.humidity < thresholds.humidityLow) {
      const alert = await createAlert({
        deviceId: sensorData.deviceId,
        type: 'humidity_low',
        message: `Humidity is too low: ${sensorData.humidity}%`,
        value: sensorData.humidity,
        threshold: thresholds.humidityLow
      });
      alerts.push(alert);
    }
    
    // Check motion detection
    if (sensorData.motion && thresholds.motionDetection) {
      const alert = await createAlert({
        deviceId: sensorData.deviceId,
        type: 'motion_detected',
        message: `Motion detected by PIR sensor`,
        value: 1,
        threshold: 1
      });
      alerts.push(alert);
    }
    
    return alerts;
    
  } catch (error) {
    console.error('Error checking thresholds:', error);
    return [];
  }
}

/**
 * Create and save alert
 */
async function createAlert(alertData) {
  try {
    // Check if similar alert exists in last 5 minutes (avoid spam)
    const recentAlert = await Alert.findOne({
      deviceId: alertData.deviceId,
      type: alertData.type,
      status: 'active',
      createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) }
    });
    
    if (recentAlert) {
      console.log(`⚠ Similar alert already exists, skipping: ${alertData.type}`);
      return recentAlert;
    }
    
    // Create new alert
    const alert = new Alert(alertData);
    await alert.save();
    
    console.log(`⚠ Alert created: ${alertData.type} - ${alertData.message}`);
    
    // Send Telegram notification
    const telegramSent = await sendTelegramAlert(alert);
    
    if (telegramSent) {
      alert.telegramSent = true;
      await alert.save();
    }
    
    return alert;
    
  } catch (error) {
    console.error('Error creating alert:', error);
    throw error;
  }
}

module.exports = {
  checkThresholds,
  createAlert
};
