import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { complaintApi } from '../api';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';
import { Timeline } from '../components/Timeline';
import { Loader } from '../components/Loader';
import { Alert } from '../components/Alert';
import { 
  Search, 
  MapPin, 
  Building2, 
  Calendar, 
  FileImage, 
  CheckCircle2, 
  RotateCcw, 
  MessageSquare, 
  AlertCircle 
} from 'lucide-react';

export const TrackPage = () => {
  const [searchParams] = useSearchParams();
  const [complaintNumber, setComplaintNumber] = useState(searchParams.get('id') || '');
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTracking = async (numberToTrack) => {
    if (!numberToTrack || !numberToTrack.trim()) return;
    setLoading(true);
    setError('');
    setComplaint(null);

    try {
      const res = await complaintApi.trackByNumber(numberToTrack.trim().toUpperCase());
      if (res.data && res.data.data) {
        setComplaint(res.data.data);
      } else {
        setError('No complaint found with that ID');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Complaint not found. Please verify the ID.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const idFromUrl = searchParams.get('id');
    if (idFromUrl) {
      setComplaintNumber(idFromUrl);
      fetchTracking(idFromUrl);
    }
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTracking(complaintNumber);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      return new Date(dateStr).toLocaleString('en-IN', {
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
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: '850px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ color: 'var(--accent-green)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>
            Public Verification Portal
          </span>
          <h1 style={{ fontSize: '2.2rem', color: 'var(--primary-navy)', fontWeight: 800, marginTop: '0.25rem' }}>
            Track Complaint Status
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
            Enter your unique Complaint ID (e.g. <code>MUNIC-2026-0001</code>) to inspect live field updates.
          </p>
        </div>

        {/* Tracking Input Card */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              required
              placeholder="e.g. MUNIC-2026-0001"
              value={complaintNumber}
              onChange={(e) => setComplaintNumber(e.target.value)}
              className="form-control"
              style={{ flex: 1, minWidth: '240px', textTransform: 'uppercase', fontWeight: 600 }}
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Search size={18} /> {loading ? 'Searching...' : 'Track Issue'}
            </button>
          </form>

          {/* Sample quick search pills */}
          <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <span>Quick Test IDs:</span>
            {['MUNIC-2026-0001', 'MUNIC-2026-0002', 'MUNIC-2026-0003'].map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setComplaintNumber(id);
                  fetchTracking(id);
                }}
                style={{
                  background: '#f1f5f9',
                  border: '1px solid var(--border-color)',
                  padding: '0.2rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  color: 'var(--primary-navy)',
                  fontWeight: 600,
                }}
              >
                {id}
              </button>
            ))}
          </div>
        </div>

        {error && <Alert type="error" message={error} />}

        {loading && <Loader text="Retrieving complaint records from municipal server..." />}

        {complaint && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Header Card */}
            <div className="card" style={{ borderLeft: '5px solid var(--accent-green)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-navy)' }}>
                      {complaint.complaintNumber}
                    </span>
                    <StatusBadge status={complaint.status} />
                    <PriorityBadge priority={complaint.priority} />
                  </div>
                  <h2 style={{ fontSize: '1.25rem', color: 'var(--primary-navy)', fontWeight: 700 }}>
                    {complaint.title}
                  </h2>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                  <div>Filed on: <strong>{formatDate(complaint.createdAt)}</strong></div>
                  <div>Last Updated: <strong>{formatDate(complaint.updatedAt)}</strong></div>
                </div>
              </div>

              <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: '1.6', background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                {complaint.description}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1.25rem', fontSize: '0.9rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>Category</span>
                  <strong>{complaint.categoryName}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>Assigned Department</span>
                  <strong>{complaint.departmentName || 'Under Review / Unassigned'}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>Locality / Ward</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={14} color="var(--accent-green)" />
                    <strong>{complaint.locality}</strong>
                  </div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>Detailed Address</span>
                  <span>{complaint.address} {complaint.landmark ? `(Near: ${complaint.landmark})` : ''}</span>
                </div>
              </div>
            </div>

            {/* Images Card (Reported Photo and Resolution Photo) */}
            {(complaint.imageUrl || complaint.resolutionImageUrl) && (
              <div className="card">
                <h3 className="card-title">
                  <FileImage size={18} /> Photographic Evidence
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginTop: '1rem' }}>
                  {complaint.imageUrl && (
                    <div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                        Reported Problem Photograph:
                      </span>
                      <div style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border-color)', height: '220px', background: '#000' }}>
                        <img
                          src={complaint.imageUrl}
                          alt="Reported Issue"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=500&auto=format&fit=crop&q=60'; }}
                        />
                      </div>
                    </div>
                  )}

                  {complaint.resolutionImageUrl && (
                    <div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-green-dark)', display: 'block', marginBottom: '0.4rem' }}>
                        Post-Repair Resolution Proof:
                      </span>
                      <div style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '2px solid var(--accent-green)', height: '220px', background: '#000' }}>
                        <img
                          src={complaint.resolutionImageUrl}
                          alt="Resolution Proof"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&auto=format&fit=crop&q=60'; }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Resolution Details Card */}
            {complaint.status === 'RESOLVED' && (
              <div className="card" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
                <h3 style={{ fontSize: '1.15rem', color: '#166534', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <CheckCircle2 size={20} color="#166534" /> Official Resolution Summary
                </h3>
                <p style={{ color: '#14532d', fontSize: '0.95rem', lineHeight: '1.6' }}>
                  {complaint.resolutionDetails}
                </p>
                <div style={{ fontSize: '0.82rem', color: '#15803d', marginTop: '0.75rem' }}>
                  Resolved on: {formatDate(complaint.resolvedAt)}
                </div>
              </div>
            )}

            {/* Rejection Details Card */}
            {complaint.status === 'REJECTED' && (
              <div className="card" style={{ background: '#fef2f2', borderColor: '#fecaca' }}>
                <h3 style={{ fontSize: '1.15rem', color: '#991b1b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <AlertCircle size={20} color="#991b1b" /> Municipal Rejection Notice
                </h3>
                <p style={{ color: '#7f1d1d', fontSize: '0.95rem', lineHeight: '1.6' }}>
                  {complaint.rejectionReason}
                </p>
              </div>
            )}

            {/* Timeline Audit Trail */}
            <div className="card">
              <h3 className="card-title">
                Status History & Progression Timeline
              </h3>
              <Timeline history={complaint.history} />
            </div>

            {/* Next actions prompt for citizen */}
            <div style={{ textAlign: 'center', padding: '1rem', background: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Are you the citizen who filed this complaint?{' '}
              </span>
              <Link to="/login" style={{ color: 'var(--accent-green-dark)', fontWeight: 600, textDecoration: 'underline' }}>
                Log in to rate service or reopen if needed
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
