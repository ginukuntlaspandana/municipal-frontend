import React from 'react';
import { StatusBadge } from './StatusBadge';
import { Calendar, User } from 'lucide-react';

export const Timeline = ({ history = [] }) => {
  if (!history || history.length === 0) {
    return <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No status history available.</p>;
  }

  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="timeline">
      {history.map((item, index) => (
        <div key={item.id || index} className="timeline-item">
          <div className="timeline-marker" />
          <div className="timeline-header">
            <StatusBadge status={item.newStatus} />
            <span className="timeline-time" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Calendar size={12} />
              {formatDate(item.timestamp)}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            <User size={12} />
            <span>Action by: <strong>{item.changedByName || 'System'}</strong></span>
          </div>

          {item.remarks && (
            <div className="timeline-body">
              {item.remarks}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
