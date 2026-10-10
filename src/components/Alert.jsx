import React from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

export const Alert = ({ type = 'info', message, onClose }) => {
  if (!message) return null;

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  };

  const Icon = icons[type] || Info;

  return (
    <div className={`alert alert-${type}`}>
      <Icon size={18} style={{ flexShrink: 0 }} />
      <div style={{ flex: 1 }}>{message}</div>
    </div>
  );
};
