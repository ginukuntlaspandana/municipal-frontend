import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { complaintApi, publicApi } from '../api';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';
import { Loader } from '../components/Loader';
import { 
  ListCheck, 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  FilePlus2, 
  ChevronRight,
  RotateCcw
} from 'lucide-react';

export const MyComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    Promise.all([complaintApi.getMyComplaints(), publicApi.getCategories()])
      .then(([complaintsRes, categoriesRes]) => {
        if (complaintsRes.data && complaintsRes.data.data) {
          setComplaints(complaintsRes.data.data);
        }
        if (categoriesRes.data && categoriesRes.data.data) {
          setCategories(categoriesRes.data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = complaints.filter((c) => {
    const matchesSearch =
      search === '' ||
      c.complaintNumber?.toLowerCase().includes(search.toLowerCase()) ||
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.locality?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === '' || c.status === statusFilter;
    const matchesCategory = categoryFilter === '' || c.categoryName === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

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
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <span style={{ color: 'var(--accent-green-dark)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>
            Complaint Registry
          </span>
          <h1 style={{ fontSize: '2.2rem', color: 'var(--primary-navy)', fontWeight: 800 }}>
            My Filed Complaints
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Track the status of all your submitted complaints and review resolution progress.
          </p>
        </div>

        <Link to="/citizen/submit" className="btn btn-primary">
          <FilePlus2 size={18} /> Lodge New Complaint
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'center' }}>
          <div>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Search Grievance</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="ID, Title, Locality..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-control"
              />
            </div>
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Filter by Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-control"
            >
              <option value="">All Statuses</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="REJECTED">Rejected</option>
              <option value="REOPENED">Reopened</option>
            </select>
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Filter by Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="form-control"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setStatusFilter('');
                setCategoryFilter('');
              }}
              className="btn btn-outline"
              style={{ width: '100%', marginTop: 'auto' }}
            >
              <RotateCcw size={14} /> Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Complaints List */}
      <div className="card">
        {loading ? (
          <Loader text="Loading complaints..." />
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '1rem' }}>
              No complaints found matching the criteria.
            </p>
            {(search || statusFilter || categoryFilter) && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setStatusFilter('');
                  setCategoryFilter('');
                }}
                className="btn btn-outline btn-sm"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Complaint ID</th>
                  <th>Title & Category</th>
                  <th>Locality & Address</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Filed Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
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
                        <strong>{c.locality}</strong>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{c.address}</div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem' }}>{c.departmentName || 'Under Review'}</span>
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
                      <Link to={`/citizen/complaints/${c.id}`} className="btn btn-primary btn-sm">
                        View <ChevronRight size={13} />
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
