import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../api';
import { StatCard } from '../components/StatCard';
import { Loader } from '../components/Loader';
import { Alert } from '../components/Alert';
import { 
  Building2, 
  ShieldAlert, 
  Clock, 
  UserCheck, 
  PlayCircle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Star, 
  Users, 
  Building, 
  Download, 
  ChevronRight,
  TrendingUp,
  BarChart2,
  PieChart
} from 'lucide-react';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getDashboardStats();
      if (res.data && res.data.data) {
        setStats(res.data.data);
      }
    } catch (err) {
      setError('Failed to fetch dashboard metrics from server.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleExportCsv = async () => {
    try {
      setExporting(true);
      const res = await adminApi.exportCsv();
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'text/csv' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `municipal_complaints_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      alert('Failed to export CSV: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <div className="container" style={{ padding: '3rem' }}><Loader text="Compiling live municipal metrics..." /></div>;
  if (error) return <div className="container" style={{ padding: '3rem' }}><Alert type="error" message={error} /></div>;
  if (!stats) return null;

  // Chart 1: Category Distribution Doughnut
  const categoryLabels = (stats.categoryDistribution || []).map((c) => c.categoryName);
  const categoryCounts = (stats.categoryDistribution || []).map((c) => c.count);
  const doughnutData = {
    labels: categoryLabels.length > 0 ? categoryLabels : ['No Data'],
    datasets: [
      {
        data: categoryCounts.length > 0 ? categoryCounts : [1],
        backgroundColor: [
          '#10b981',
          '#0284c7',
          '#f59e0b',
          '#8b5cf6',
          '#ef4444',
          '#14b8a6',
          '#64748b',
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  // Chart 2: Locality Bar Chart
  const localityLabels = (stats.localityDistribution || []).slice(0, 7).map((l) => l.locality);
  const localityCounts = (stats.localityDistribution || []).slice(0, 7).map((l) => l.count);
  const barData = {
    labels: localityLabels.length > 0 ? localityLabels : ['No Data'],
    datasets: [
      {
        label: 'Reported Grievances',
        data: localityCounts.length > 0 ? localityCounts : [0],
        backgroundColor: '#0f2b48',
        borderRadius: 4,
      },
    ],
  };

  // Chart 3: Monthly Trends Line Chart
  const monthLabels = (stats.monthlyTrends || []).map((m) => m.month);
  const monthCounts = (stats.monthlyTrends || []).map((m) => m.count);
  const lineData = {
    labels: monthLabels.length > 0 ? monthLabels : ['Current Month'],
    datasets: [
      {
        label: 'Complaint Submissions',
        data: monthCounts.length > 0 ? monthCounts : [stats.totalComplaints || 0],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.3,
        pointBackgroundColor: '#10b981',
        pointRadius: 5,
      },
    ],
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <span style={{ color: 'var(--accent-green-dark)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>
            Administrative Command Center
          </span>
          <h1 style={{ fontSize: '2.2rem', color: 'var(--primary-navy)', fontWeight: 800 }}>
            Municipal Grievance Operations
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Live status overview, departmental routing, resolution auditing, and civic metrics.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={exporting}
            className="btn btn-outline"
          >
            <Download size={16} /> {exporting ? 'Generating CSV...' : 'Export to CSV'}
          </button>
          <Link to="/admin/complaints" className="btn btn-primary">
            <ShieldAlert size={16} /> Manage Complaints ({stats.totalComplaints})
          </Link>
        </div>
      </div>

      {/* Primary Key Metric Cards */}
      <div className="stats-grid">
        <StatCard
          icon={ShieldAlert}
          label="Total Grievances"
          value={stats.totalComplaints}
          color="#0f2b48"
          bg="#e2e8f0"
        />
        <StatCard
          icon={Clock}
          label="Pending Review"
          value={stats.pendingComplaints}
          color="#1e40af"
          bg="#dbeafe"
        />
        <StatCard
          icon={UserCheck}
          label="Assigned to Depts"
          value={stats.assignedComplaints}
          color="#0284c7"
          bg="#e0f2fe"
        />
        <StatCard
          icon={PlayCircle}
          label="In Progress (On Ground)"
          value={stats.inProgressComplaints}
          color="#d97706"
          bg="#fef3c7"
        />
        <StatCard
          icon={CheckCircle2}
          label="Successfully Resolved"
          value={stats.resolvedComplaints}
          color="#047857"
          bg="#d1fae5"
        />
        <StatCard
          icon={XCircle}
          label="Rejected / Duplicate"
          value={stats.rejectedComplaints}
          color="#dc2626"
          bg="#fee2e2"
        />
        <StatCard
          icon={RotateCcw}
          label="Reopened by Citizens"
          value={stats.reopenedComplaints}
          color="#ea580c"
          bg="#ffedd5"
        />
        <StatCard
          icon={Star}
          label="Citizen Rating Avg"
          value={`${stats.averageFeedbackRating || 0} / 5`}
          color="#ca8a04"
          bg="#fef9c3"
        />
      </div>

      {/* Secondary Metrics Ribbon */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <TrendingUp size={22} color="var(--accent-green)" />
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Average Resolution Time</div>
            <strong style={{ fontSize: '1.1rem', color: 'var(--primary-navy)' }}>
              {stats.averageResolutionHours > 0 ? `${stats.averageResolutionHours} Hours` : 'N/A (Pending)'}
            </strong>
          </div>
        </div>

        <div className="card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Users size={22} color="var(--accent-green)" />
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Registered Citizens</div>
            <strong style={{ fontSize: '1.1rem', color: 'var(--primary-navy)' }}>
              {stats.totalCitizens} Residents
            </strong>
          </div>
        </div>

        <div className="card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Building size={22} color="var(--accent-green)" />
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Municipal Departments</div>
            <strong style={{ fontSize: '1.1rem', color: 'var(--primary-navy)' }}>
              {stats.totalDepartments} Active Units
            </strong>
          </div>
        </div>
      </div>

      {/* Analytics Visualizations */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Doughnut Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <PieChart size={18} /> Issues by Category
            </h3>
          </div>
          <div style={{ height: '260px', display: 'flex', justifyContent: 'center' }}>
            <Doughnut
              data={doughnutData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom' },
                },
              }}
            />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <BarChart2 size={18} /> Grievances by Locality / Ward
            </h3>
          </div>
          <div style={{ height: '260px' }}>
            <Bar
              data={barData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  y: { beginAtZero: true, ticks: { stepSize: 1 } },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        <Link to="/admin/complaints?status=SUBMITTED" className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong>Needs Verification</strong>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Inspect new submitted complaints</p>
          </div>
          <ChevronRight size={20} color="var(--accent-green)" />
        </Link>

        <Link to="/admin/departments" className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong>Departments Directory</strong>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Manage contact & routing channels</p>
          </div>
          <ChevronRight size={20} color="var(--accent-green)" />
        </Link>

        <Link to="/admin/reports" className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong>Export & Detailed Reports</strong>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Generate compliance summaries</p>
          </div>
          <ChevronRight size={20} color="var(--accent-green)" />
        </Link>

        <Link to="/admin/feedback" className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong>Citizen Feedback Audits</strong>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Review satisfaction scores</p>
          </div>
          <ChevronRight size={20} color="var(--accent-green)" />
        </Link>
      </div>
    </div>
  );
};
