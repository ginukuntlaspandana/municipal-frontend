import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { adminApi, publicApi } from '../api';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';
import { Loader } from '../components/Loader';
import { Alert } from '../components/Alert';
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  Download, 
  RotateCcw, 
  MapPin, 
  Calendar, 
  User, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown 
} from 'lucide-react';

export const AllComplaintsPage = () => {
  const [searchParams] = useSearchParams();

  const [complaints, setComplaints] = useState([]);
  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  // Filters State
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [priority, setPriority] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Pagination & Sorting State
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');

  // Load auxiliary data
  useEffect(() => {
    Promise.all([publicApi.getCategories(), publicApi.getDepartments()])
      .then(([catsRes, deptsRes]) => {
        if (catsRes.data?.data) setCategories(catsRes.data.data);
        if (deptsRes.data?.data) setDepartments(deptsRes.data.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size,
        sortBy,
        sortDir,
      };
      if (search.trim()) params.search = search.trim();
      if (status) params.status = status;
      if (priority) params.priority = priority;
      if (categoryId) params.categoryId = categoryId;
      if (departmentId) params.departmentId = departmentId;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await adminApi.getComplaints(params);
      if (res.data?.data) {
        setComplaints(res.data.data.content || []);
        setTotalPages(res.data.data.totalPages || 0);
        setTotalElements(res.data.data.totalElements || 0);
      }
    } catch (err) {
      console.error('Failed to load admin complaints', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [page, size, sortBy, sortDir, status, priority, categoryId, departmentId, startDate, endDate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchComplaints();
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatus('');
    setPriority('');
    setCategoryId('');
    setDepartmentId('');
    setStartDate('');
    setEndDate('');
    setPage(0);
  };

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
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <span style={{ color: 'var(--accent-green-dark)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>
            Authority Operations
          </span>
          <h1 style={{ fontSize: '2rem', color: 'var(--primary-navy)', fontWeight: 800 }}>
            Master Complaints Registry
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Inspect, triage, assign, update priority, and audit all {totalElements} registered civic issues.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={exporting}
            className="btn btn-outline"
          >
            <Download size={16} /> {exporting ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>
      </div>

      {/* Advanced Filter Console */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <form onSubmit={handleSearchSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
            {/* Search */}
            <div>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Keyword Search</label>
              <input
                type="text"
                placeholder="ID, Title, Locality..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-control"
              />
            </div>

            {/* Status */}
            <div>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Status</label>
              <select
                value={status}
                onChange={(e) => { setStatus(e.target.value); setPage(0); }}
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

            {/* Priority */}
            <div>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Priority</label>
              <select
                value={priority}
                onChange={(e) => { setPriority(e.target.value); setPage(0); }}
                className="form-control"
              >
                <option value="">All Priorities</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Category</label>
              <select
                value={categoryId}
                onChange={(e) => { setCategoryId(e.target.value); setPage(0); }}
                className="form-control"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Department */}
            <div>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Department</label>
              <select
                value={departmentId}
                onChange={(e) => { setDepartmentId(e.target.value); setPage(0); }}
                className="form-control"
              >
                <option value="">All Departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            {/* Date Range Start */}
            <div>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>From Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); setPage(0); }}
                className="form-control"
              />
            </div>

            {/* Date Range End */}
            <div>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>To Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); setPage(0); }}
                className="form-control"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
            <button type="button" onClick={handleResetFilters} className="btn btn-outline btn-sm">
              <RotateCcw size={14} /> Reset
            </button>
            <button type="submit" className="btn btn-navy btn-sm">
              <Search size={14} /> Filter Results
            </button>
          </div>
        </form>
      </div>

      {/* Complaints Table */}
      <div className="card">
        {loading ? (
          <Loader text="Loading complaints..." />
        ) : complaints.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '1rem' }}>
              No complaints found matching current filters.
            </p>
            <button type="button" onClick={handleResetFilters} className="btn btn-outline btn-sm">
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Complaint ID</th>
                    <th>Issue Title</th>
                    <th>Category</th>
                    <th>Department</th>
                    <th>Locality</th>
                    <th>Citizen Name</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Filed On</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <strong style={{ color: 'var(--primary-navy)', fontFamily: 'monospace', fontSize: '0.92rem' }}>
                          {c.complaintNumber}
                        </strong>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {c.title}
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem' }}>{c.categoryName}</span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem', color: c.departmentName === 'Unassigned' ? '#dc2626' : 'var(--text-main)', fontWeight: c.departmentName === 'Unassigned' ? 600 : 400 }}>
                          {c.departmentName || 'Unassigned'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem' }}>
                          <MapPin size={12} color="var(--accent-green)" />
                          {c.locality}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem' }}>{c.citizenName}</div>
                      </td>
                      <td>
                        <StatusBadge status={c.status} />
                      </td>
                      <td>
                        <PriorityBadge priority={c.priority} />
                      </td>
                      <td>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          {formatDate(c.createdAt)}
                        </span>
                      </td>
                      <td>
                        <Link to={`/admin/complaints/${c.id}`} className="btn btn-navy btn-sm">
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Showing page <strong>{page + 1}</strong> of <strong>{totalPages || 1}</strong> ({totalElements} total records)
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <select
                  value={size}
                  onChange={(e) => { setSize(Number(e.target.value)); setPage(0); }}
                  className="form-control"
                  style={{ width: 'auto', padding: '0.3rem 0.6rem', fontSize: '0.85rem' }}
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                  <option value={50}>50 per page</option>
                </select>

                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="btn btn-outline btn-sm"
                >
                  <ChevronLeft size={16} /> Prev
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="btn btn-outline btn-sm"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
