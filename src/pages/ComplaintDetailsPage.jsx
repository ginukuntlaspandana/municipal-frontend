import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { complaintApi } from '../api';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';
import { Timeline } from '../components/Timeline';
import { Modal } from '../components/Modal';
import { Alert } from '../components/Alert';
import { Loader } from '../components/Loader';
import { 
  ArrowLeft, 
  MapPin, 
  Building2, 
  Calendar, 
  FileImage, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  Star, 
  Send,
  MessageSquare
} from 'lucide-react';

export const ComplaintDetailsPage = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Reopen Modal state
  const [isReopenOpen, setIsReopenOpen] = useState(false);
  const [reopenReason, setReopenReason] = useState('');
  const [reopening, setReopening] = useState(false);

  // Feedback form state
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await complaintApi.getById(id);
      if (res.data && res.data.data) {
        setComplaint(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load complaint details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleReopenSubmit = async (e) => {
    e.preventDefault();
    if (!reopenReason.trim() || reopenReason.trim().length < 5) {
      alert('Please provide a reason with at least 5 characters.');
      return;
    }

    setReopening(true);
    try {
      const res = await complaintApi.reopen(id, { reason: reopenReason.trim() });
      setComplaint(res.data.data);
      setIsReopenOpen(false);
      setReopenReason('');
      setSuccessMsg('Complaint has been reopened. Municipal authorities have been notified.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reopen complaint.');
    } finally {
      setReopening(false);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setSubmittingFeedback(true);
    try {
      const res = await complaintApi.submitFeedback(id, {
        rating,
        comments: feedbackComment.trim(),
      });
      setSuccessMsg('Thank you! Your rating and feedback have been recorded.');
      fetchDetails();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit feedback.');
    } finally {
      setSubmittingFeedback(false);
    }
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

  if (loading) return <div className="container" style={{ padding: '3rem' }}><Loader text="Loading complaint details..." /></div>;
  if (error) return <div className="container" style={{ padding: '3rem' }}><Alert type="error" message={error} /></div>;
  if (!complaint) return null;

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Link to="/citizen/complaints" className="btn btn-outline btn-sm" style={{ marginBottom: '1.5rem' }}>
          <ArrowLeft size={16} /> Back to My Complaints
        </Link>

        {successMsg && <Alert type="success" message={successMsg} />}

        {/* Complaint Header Card */}
        <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '5px solid var(--accent-green)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary-navy)', fontFamily: 'monospace' }}>
                  {complaint.complaintNumber}
                </span>
                <StatusBadge status={complaint.status} />
                <PriorityBadge priority={complaint.priority} />
              </div>
              <h1 style={{ fontSize: '1.35rem', color: 'var(--primary-navy)', fontWeight: 700 }}>
                {complaint.title}
              </h1>
            </div>

            {/* Quick Action Button for Reopening */}
            {(complaint.status === 'RESOLVED' || complaint.status === 'REJECTED') && (
              <button
                type="button"
                onClick={() => setIsReopenOpen(true)}
                className="btn btn-danger btn-sm"
              >
                <RotateCcw size={15} /> Reopen Grievance
              </button>
            )}
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
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>Street Address</span>
              <span>{complaint.address} {complaint.landmark ? `(Near: ${complaint.landmark})` : ''}</span>
            </div>
          </div>
        </div>

        {/* Photographic Evidence Card */}
        {(complaint.imageUrl || complaint.resolutionImageUrl) && (
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 className="card-title">
              <FileImage size={18} /> Photographic Evidence
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginTop: '1rem' }}>
              {complaint.imageUrl && (
                <div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                    Reported Problem Photograph:
                  </span>
                  <div style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border-color)', height: '220px', background: '#000' }}>
                    <img
                      src={complaint.imageUrl}
                      alt="Reported Problem"
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

        {/* Resolution Section (When Resolved) */}
        {complaint.status === 'RESOLVED' && (
          <div className="card" style={{ marginBottom: '1.5rem', background: '#f0fdf4', borderColor: '#bbf7d0' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#166534', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <CheckCircle2 size={20} color="#166534" /> Official Resolution Notes
            </h3>
            <p style={{ color: '#14532d', fontSize: '0.95rem', lineHeight: '1.6' }}>
              {complaint.resolutionDetails}
            </p>
            <div style={{ fontSize: '0.82rem', color: '#15803d', marginTop: '0.75rem' }}>
              Resolved on: <strong>{formatDate(complaint.resolvedAt)}</strong>
            </div>
          </div>
        )}

        {/* Citizen Feedback / Rating Card */}
        {complaint.status === 'RESOLVED' && (
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 className="card-title">
              <Star size={18} color="#eab308" /> Citizen Rating & Feedback
            </h3>

            {complaint.feedback ? (
              <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-sm)', marginTop: '0.75rem', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.5rem' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={20}
                      fill={star <= complaint.feedback.rating ? '#eab308' : 'none'}
                      color={star <= complaint.feedback.rating ? '#eab308' : '#cbd5e1'}
                    />
                  ))}
                  <span style={{ fontWeight: 700, marginLeft: '0.5rem', color: 'var(--primary-navy)' }}>
                    {complaint.feedback.rating} / 5 Stars
                  </span>
                </div>
                {complaint.feedback.comments && (
                  <p style={{ color: 'var(--text-main)', fontSize: '0.92rem', fontStyle: 'italic', marginTop: '0.5rem' }}>
                    "{complaint.feedback.comments}"
                  </p>
                )}
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  Submitted on {formatDate(complaint.feedback.createdAt)}
                </div>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} style={{ marginTop: '1rem' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Please rate how satisfied you are with the speed and quality of this municipal resolution:
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.25rem' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={28}
                      style={{ cursor: 'pointer', transition: 'transform 0.1s' }}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      fill={(hoverRating || rating) >= star ? '#eab308' : 'none'}
                      color={(hoverRating || rating) >= star ? '#eab308' : '#94a3b8'}
                    />
                  ))}
                  <span style={{ marginLeft: '0.75rem', fontWeight: 700, color: 'var(--primary-navy)' }}>
                    {rating} Star{rating > 1 ? 's' : ''}
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label">Feedback Comments (Optional)</label>
                  <textarea
                    rows={3}
                    className="form-control"
                    placeholder="Share any comments regarding the work done..."
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={submittingFeedback}>
                  <Send size={16} /> {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Status Audit History Timeline */}
        <div className="card">
          <h3 className="card-title">
            <Calendar size={18} /> Official Status History & Timeline
          </h3>
          <Timeline history={complaint.history} />
        </div>

        {/* Reopen Modal */}
        <Modal
          isOpen={isReopenOpen}
          onClose={() => setIsReopenOpen(false)}
          title="Reopen Municipal Complaint"
        >
          <form onSubmit={handleReopenSubmit}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              If the problem was not adequately solved on site or has recurred, please explain what is pending so the department can be re-dispatched.
            </p>

            <div className="form-group">
              <label className="form-label">
                Reason for Reopening <span className="required">*</span>
              </label>
              <textarea
                required
                rows={4}
                className="form-control"
                placeholder="e.g. Only half the waste was cleared / The pothole was patched unevenly..."
                value={reopenReason}
                onChange={(e) => setReopenReason(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setIsReopenOpen(false)}
                className="btn btn-outline"
                disabled={reopening}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-danger"
                disabled={reopening}
              >
                <RotateCcw size={16} /> {reopening ? 'Reopening...' : 'Confirm Reopen'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};
