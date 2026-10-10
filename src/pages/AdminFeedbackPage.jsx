import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../api';
import { Loader } from '../components/Loader';
import { MessageSquare, Star, Calendar, User, ExternalLink } from 'lucide-react';

export const AdminFeedbackPage = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getFeedback()
      .then((res) => {
        if (res.data?.data) {
          setFeedbackList(res.data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
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
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <span style={{ color: 'var(--accent-green-dark)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>
          Quality Assurance & Citizen Audits
        </span>
        <h1 style={{ fontSize: '2.2rem', color: 'var(--primary-navy)', fontWeight: 800 }}>
          Citizen Feedback & Satisfaction Ratings
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Direct feedback and ratings left by residents following municipal issue resolution.
        </p>
      </div>

      <div className="card">
        {loading ? (
          <Loader text="Loading citizen feedback..." />
        ) : feedbackList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <MessageSquare size={36} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
              No feedback records submitted yet. Feedback appears here after complaints are marked Resolved and rated by citizens.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Rating</th>
                  <th>Comments</th>
                  <th>Citizen Name</th>
                  <th>Complaint</th>
                  <th>Date Submitted</th>
                </tr>
              </thead>
              <tbody>
                {feedbackList.map((f) => (
                  <tr key={f.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={16}
                            fill={star <= f.rating ? '#eab308' : 'none'}
                            color={star <= f.rating ? '#eab308' : '#cbd5e1'}
                          />
                        ))}
                        <strong style={{ marginLeft: '0.4rem', fontSize: '0.88rem' }}>{f.rating}/5</strong>
                      </div>
                    </td>
                    <td>
                      <p style={{ fontSize: '0.9rem', fontStyle: f.comments ? 'italic' : 'normal', color: f.comments ? 'var(--text-main)' : 'var(--text-muted)' }}>
                        {f.comments ? `"${f.comments}"` : 'No written comment provided'}
                      </p>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.88rem' }}>
                        <User size={13} color="var(--accent-green)" />
                        <strong>{f.citizenName}</strong>
                      </div>
                    </td>
                    <td>
                      <Link to={`/admin/complaints/${f.complaintId}`} style={{ color: 'var(--primary-navy)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontFamily: 'monospace' }}>
                        {f.complaintNumber} <ExternalLink size={12} />
                      </Link>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{f.complaintTitle}</div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {formatDate(f.createdAt)}
                      </span>
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
