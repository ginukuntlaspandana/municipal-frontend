import React from 'react';
import { 
  Clock, 
  Search, 
  UserCheck, 
  PlayCircle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw 
} from 'lucide-react';

const statusConfig = {
  SUBMITTED: { label: 'Submitted', icon: Clock, className: 'badge-SUBMITTED' },
  UNDER_REVIEW: { label: 'Under Review', icon: Search, className: 'badge-UNDER_REVIEW' },
  ASSIGNED: { label: 'Assigned', icon: UserCheck, className: 'badge-ASSIGNED' },
  IN_PROGRESS: { label: 'In Progress', icon: PlayCircle, className: 'badge-IN_PROGRESS' },
  RESOLVED: { label: 'Resolved', icon: CheckCircle2, className: 'badge-RESOLVED' },
  REJECTED: { label: 'Rejected', icon: XCircle, className: 'badge-REJECTED' },
  REOPENED: { label: 'Reopened', icon: RotateCcw, className: 'badge-REOPENED' },
};

export const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || {
    label: status || 'Unknown',
    icon: Clock,
    className: 'badge-SUBMITTED',
  };
  const Icon = config.icon;

  return (
    <span className={`badge ${config.className}`}>
      <Icon size={12} />
      {config.label}
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  const p = priority || 'MEDIUM';
  return (
    <span className={`badge badge-priority-${p}`}>
      {p}
    </span>
  );
};
