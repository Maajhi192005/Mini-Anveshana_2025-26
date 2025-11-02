import { useState, useEffect } from 'react';
import { Activity, Droplets, Thermometer, AlertCircle, TrendingUp, Eye } from 'lucide-react';
import SensorCard from '../components/SensorCard';
import ChartCard from '../components/ChartCard';
import AlertsList from '../components/AlertsList';
import SensorVisualization3D from '../components/SensorVisualization3D';
import { getSensorData, getLatestData, getAlerts } from '../services/api';
import './Dashboard.css';

function Dashboard() {
  const [latestData, setLatestData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wsConnected, setWsConnected] = useState(false);

  // Fetch initial data
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  // WebSocket connection for real-time updates
  useEffect(() => {
    connectWebSocket();
  }, []);

  const fetchData = async () => {
    try {
      const [latest, history, alertsData] = await Promise.all([
        getLatestData(),
        getSensorData({ limit: 50 }),
        getAlerts({ limit: 10 })
      ]);

      setLatestData(latest.data);
      setHistoricalData(history.data);
      setAlerts(alertsData.alerts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const connectWebSocket = () => {
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3000/ws';
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('✓ WebSocket connected');
      setWsConnected(true);
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      if (message.type === 'sensor_update') {
        setLatestData(message.data);
        // Add to historical data
        setHistoricalData(prev => [message.data, ...prev].slice(0, 50));
      } else if (message.type === 'alert') {
        setAlerts(prev => [message.alert, ...prev]);
      }
    };

    ws.onclose = () => {
      console.log('✗ WebSocket disconnected');
      setWsConnected(false);
      // Reconnect after 5 seconds
      setTimeout(connectWebSocket, 5000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const activeAlerts = alerts.filter(a => a.status === 'active');

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <div>
              <h1>
                <Activity className="header-icon" />
                ESP32 IoT Dashboard
              </h1>
              <p className="header-subtitle">
                Real-time sensor monitoring with Telegram alerts
              </p>
            </div>
            <div className="header-status">
              <div className={`status-badge ${wsConnected ? 'connected' : 'disconnected'}`}>
                <span className="status-dot"></span>
                {wsConnected ? 'Live' : 'Offline'}
              </div>
              {activeAlerts.length > 0 && (
                <div className="alert-badge">
                  <AlertCircle size={16} />
                  {activeAlerts.length} Active Alerts
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container dashboard-content">
        {/* Sensor Cards */}
        <section className="sensor-grid">
          <SensorCard
            title="Temperature"
            value={latestData?.data?.temperature || latestData?.temperature || 0}
            unit="°C"
            icon={<Thermometer />}
            color="#ef4444"
            trend={calculateTrend(historicalData, 'temperature')}
          />
          <SensorCard
            title="Humidity"
            value={latestData?.data?.humidity || latestData?.humidity || 0}
            unit="%"
            icon={<Droplets />}
            color="#3b82f6"
            trend={calculateTrend(historicalData, 'humidity')}
          />
          <SensorCard
            title="Motion Sensor"
            value={latestData?.data?.motion || latestData?.motion ? 'Detected' : 'None'}
            unit=""
            icon={<Eye />}
            color="#8b5cf6"
            isBoolean={true}
          />
        </section>

        {/* 3D Visualization */}
        <section className="visualization-section">
          <div className="card">
            <h2 className="section-title">
              <TrendingUp size={20} />
              3D Sensor Visualization
            </h2>
            <SensorVisualization3D data={latestData?.data || latestData} />
          </div>
        </section>

        {/* Charts */}
        <section className="charts-section">
          <ChartCard
            title="Temperature History"
            data={historicalData}
            dataKey="temperature"
            color="#ef4444"
            unit="°C"
          />
          <ChartCard
            title="Humidity History"
            data={historicalData}
            dataKey="humidity"
            color="#3b82f6"
            unit="%"
          />
        </section>

        {/* Alerts */}
        {alerts.length > 0 && (
          <section className="alerts-section">
            <div className="card">
              <h2 className="section-title">
                <AlertCircle size={20} />
                Recent Alerts
              </h2>
              <AlertsList alerts={alerts} />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

// Helper function to calculate trend
function calculateTrend(data, key) {
  if (!data || data.length < 2) return 0;
  
  const recent = data.slice(0, 10);
  const values = recent.map(d => d[key]).filter(v => v !== undefined);
  
  if (values.length < 2) return 0;
  
  const first = values[values.length - 1];
  const last = values[0];
  return ((last - first) / first * 100).toFixed(1);
}

export default Dashboard;
