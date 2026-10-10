import React from 'react';

export const StatCard = ({ icon: Icon, label, value, color = '#10b981', bg = '#d1fae5' }) => {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ backgroundColor: bg, color }}>
        <Icon size={24} />
      </div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
};
