import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { complaintApi } from '../api';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';
import { StatCard } from '../components/StatCard';
import { Loader } from '../components/Loader';
import { 
  FilePlus2, 
  ListCheck, 
  Search, 
  Clock, 
  CheckCircle2, 
  PlayCircle, 
  AlertCircle, 
  ChevronRight,
  MapPin,
  Calendar
} from 'lucide-react';

export const UserDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    complaintApi.getMyComplaints()
      .then((res) => {
        if (res.data && res.data.data) {
          setComplaints(res.data.data);
        }
      })
      .catch((err) => console.error('Failed to load user complaints:', err))
      .finally(() => setLoading(false));
  }, []);

  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === 'SUBMITTED' || c.status === 'UNDER_REVIEW').length;
  const inProgress = complaints.filter((c) => c.status === 'IN_PROGRESS' || c.status === 'ASSIGNED').length;
  const resolved = complaints.filter((c) => c.status === 'RESOLVED').length;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      {/* Welcome Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <span style={{ color: 'var(--accent-green-dark)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>
            Citizen Grievance Workspace
          </span>
          <h1 style={{ fontSize: '2rem', color: 'var(--primary-navy)', fontWeight: 800 }}>
            Welcome back, {user?.fullName}!
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Track your submitted civic issues, monitor department dispatch, and verify resolutions.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/citizen/submit" className="btn btn-primary">
            <FilePlus2 size={18} /> Lodge New Complaint
          </Link>
          <Link to="/track" className="btn btn-outline">
            <Search size={18} /> Quick Track
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <StatCard
          icon={ListCheck}
          label="Total Filed Grievances"
          value={total}
          color="#0f2b48"
          bg="#e2e8f0"
        />
        <StatCard
          icon={Clock}
          label="Pending Review"
          value={pending}
          color="#1e40af"
          bg="#dbeafe"
        />
        <StatCard
          icon={PlayCircle}
          label="Active / In Progress"
          value={inProgress}
          color="#b45309"
          bg="#fef3c7"
        />
        <StatCard
          icon={CheckCircle2}
          label="Resolved Issues"
          value={resolved}
          color="#047857"
          bg="#d1fae5"
        />
      </div>

      {/* Recent Complaints Section */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <ListCheck size={20} /> My Recent Complaints
          </h2>
          <Link to="/citizen/complaints" className="btn btn-outline btn-sm">
            View All ({total}) <ChevronRight size={14} />
          </Link>
        </div>

        {loading ? (
          <Loader text="Loading your complaints..." />
        ) : complaints.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <AlertCircle size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-navy)', marginBottom: '0.5rem' }}>
              No Complaints Filed Yet
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
              Notice an overflowing bin, a dangerous road pothole, or dark streetlights? Lodge your first complaint now.
            </p>
            <Link to="/citizen/submit" className="btn btn-primary">
              <FilePlus2 size={18} /> Report an Issue
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Complaint ID</th>
                  <th>Title & Category</th>
                  <th>Locality</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Date Filed</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.slice(0, 5).map((c) => (
                  <tr key={c.id}>
                    <td>
                      <strong style={{ color: 'var(--primary-navy)', fontFamily: 'monospace', fontSize: '0.95rem' }}>
                        {c.complaintNumber}
                      </strong>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{c.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{c.categoryName}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.88rem' }}>
                        <MapPin size={13} color="var(--accent-green)" />
                        {c.locality}
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={c.status} />
                    </td>
                    <td>
                      <PriorityBadge priority={c.priority} />
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <Calendar size={13} />
                        {formatDate(c.createdAt)}
                      </div>
                    </td>
                    <td>
                      <Link to={`/citizen/complaints/${c.id}`} className="btn btn-outline btn-sm">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
