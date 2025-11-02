import { formatDistance } from 'date-fns';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import './AlertsList.css';

function AlertsList({ alerts }) {
  const getAlertIcon = (type) => {
    switch (type) {
      case 'temperature_high':
      case 'temperature_low':
        return '🌡️';
      case 'humidity_high':
      case 'humidity_low':
        return '💧';
      case 'motion_detected':
        return '🚶';
      default:
        return '⚠️';
    }
  };

  const getAlertClass = (status) => {
    switch (status) {
      case 'active':
        return 'alert-active';
      case 'acknowledged':
        return 'alert-acknowledged';
      case 'resolved':
        return 'alert-resolved';
      default:
        return '';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <AlertCircle size={16} />;
      case 'acknowledged':
        return <Clock size={16} />;
      case 'resolved':
        return <CheckCircle size={16} />;
      default:
        return null;
    }
  };

  if (alerts.length === 0) {
    return (
      <div className="no-alerts">
        <CheckCircle size={48} color="#10b981" />
        <p>No alerts at this time</p>
        <span>All systems operating normally</span>
      </div>
    );
  }

  return (
    <div className="alerts-list">
      {alerts.map((alert) => (
        <div key={alert._id} className={`alert-item ${getAlertClass(alert.status)}`}>
          <div className="alert-icon">
            {getAlertIcon(alert.type)}
          </div>
          <div className="alert-content">
            <div className="alert-header">
              <h4 className="alert-message">{alert.message}</h4>
              <span className={`alert-status ${alert.status}`}>
                {getStatusIcon(alert.status)}
                {alert.status}
              </span>
            </div>
            <div className="alert-details">
              <span className="alert-detail">
                Device: <strong>{alert.deviceId}</strong>
              </span>
              <span className="alert-detail">
                Value: <strong>{alert.value}</strong>
              </span>
              <span className="alert-detail">
                Threshold: <strong>{alert.threshold}</strong>
              </span>
              <span className="alert-time">
                {formatDistance(new Date(alert.createdAt), new Date(), { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AlertsList;
