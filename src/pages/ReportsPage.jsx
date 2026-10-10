import React, { useEffect, useState } from 'react';
import { adminApi } from '../api';
import { Loader } from '../components/Loader';
import { Alert } from '../components/Alert';
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  Clock, 
  Star, 
  ShieldAlert, 
  CheckCircle2, 
  Layers, 
  MapPin, 
  FileSpreadsheet, 
  Calendar 
} from 'lucide-react';

export const ReportsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    adminApi.getReports()
      .then((res) => {
        if (res.data?.data) {
          setStats(res.data.data);
        }
      })
      .catch((err) => {
        setError('Failed to generate reports.');
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleExportCsv = async () => {
    try {
      setExporting(true);
      const res = await adminApi.exportCsv();
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'text/csv' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `municipal_complaints_report_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      alert('Failed to export CSV: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <div className="container" style={{ padding: '3rem' }}><Loader text="Compiling analytical reports..." /></div>;
  if (error) return <div className="container" style={{ padding: '3rem' }}><Alert type="error" message={error} /></div>;
  if (!stats) return null;

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ color: 'var(--accent-green-dark)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>
            Auditing & Business Intelligence
          </span>
          <h1 style={{ fontSize: '2.2rem', color: 'var(--primary-navy)', fontWeight: 800 }}>
            Municipal Grievance Reports & Analytics
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Comprehensive performance indicators, category distributions, and CSV data extraction.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          disabled={exporting}
          className="btn btn-primary"
        >
          <FileSpreadsheet size={18} /> {exporting ? 'Generating Report...' : 'Download Full CSV Audit'}
        </button>
      </div>

      {/* KPI Overview Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ borderTop: '4px solid var(--primary-navy)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Resolution Rate</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary-navy)', marginTop: '0.25rem' }}>
            {stats.totalComplaints > 0 ? Math.round((stats.resolvedComplaints / stats.totalComplaints) * 100) : 0}%
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            {stats.resolvedComplaints} of {stats.totalComplaints} complaints closed
          </p>
        </div>

        <div className="card" style={{ borderTop: '4px solid var(--accent-green)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Average Turnaround</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent-green-dark)', marginTop: '0.25rem' }}>
            {stats.averageResolutionHours > 0 ? `${stats.averageResolutionHours}h` : '0h'}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Mean hours from filing to resolution
          </p>
        </div>

        <div className="card" style={{ borderTop: '4px solid #f59e0b' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Citizen Satisfaction</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#d97706', marginTop: '0.25rem' }}>
            {stats.averageFeedbackRating > 0 ? `${stats.averageFeedbackRating} / 5` : 'N/A'}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Average feedback score from citizens
          </p>
        </div>

        <div className="card" style={{ borderTop: '4px solid #ef4444' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Reopened Escalations</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#dc2626', marginTop: '0.25rem' }}>
            {stats.reopenedComplaints}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Complaints reopened by citizens
          </p>
        </div>
      </div>

      {/* Two-column tables: Category Breakdown & Locality Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Category Breakdown Table */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Layers size={18} /> Grievances by Issue Category
            </h3>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Complaints Count</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {(stats.categoryDistribution || []).map((cat, idx) => {
                  const pct = stats.totalComplaints > 0 ? Math.round((cat.count / stats.totalComplaints) * 100) : 0;
                  return (
                    <tr key={idx}>
                      <td><strong>{cat.categoryName}</strong></td>
                      <td>{cat.count}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ flex: 1, background: '#e2e8f0', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${pct}%`, background: 'var(--accent-green)', height: '100%' }} />
                          </div>
                          <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Locality Breakdown Table */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <MapPin size={18} /> Grievances by Locality / Ward
            </h3>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Locality</th>
                  <th>Reported Grievances</th>
                  <th>Share</th>
                </tr>
              </thead>
              <tbody>
                {(stats.localityDistribution || []).map((loc, idx) => {
                  const pct = stats.totalComplaints > 0 ? Math.round((loc.count / stats.totalComplaints) * 100) : 0;
                  return (
                    <tr key={idx}>
                      <td><strong>{loc.locality}</strong></td>
                      <td>{loc.count}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ flex: 1, background: '#e2e8f0', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${pct}%`, background: 'var(--primary-navy)', height: '100%' }} />
                          </div>
                          <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
