import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adminApi, publicApi } from '../api';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';
import { Timeline } from '../components/Timeline';
import { Modal } from '../components/Modal';
import { Alert } from '../components/Alert';
import { Loader } from '../components/Loader';
import { 
  ArrowLeft, 
  ShieldAlert, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Building, 
  Clock, 
  FileImage, 
  CheckCircle2, 
  XCircle, 
  UserCheck, 
  Flag, 
  MessageSquare, 
  Star,
  Upload,
  Save,
  Send
} from 'lucide-react';

export const AdminComplaintDetailsPage = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modals state
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [isRemarkOpen, setIsRemarkOpen] = useState(false);

  // Status form state
  const [statusVal, setStatusVal] = useState('UNDER_REVIEW');
  const [statusRemarks, setStatusRemarks] = useState('');
  const [resolutionDetails, setResolutionDetails] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [resolutionPhoto, setResolutionPhoto] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);

  // Assign form state
  const [assignDeptId, setAssignDeptId] = useState('');
  const [officerName, setOfficerName] = useState('');
  const [assignNotes, setAssignNotes] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);

  // Priority form state
  const [priorityVal, setPriorityVal] = useState('HIGH');
  const [priorityLoading, setPriorityLoading] = useState(false);

  // Remark form state
  const [remarkText, setRemarkText] = useState('');
  const [internalOnly, setInternalOnly] = useState(false);
  const [remarkLoading, setRemarkLoading] = useState(false);

  const fetchComplaintData = async () => {
    try {
      setLoading(true);
      const [compRes, deptsRes] = await Promise.all([
        adminApi.getComplaintById(id),
        publicApi.getDepartments(),
      ]);

      if (compRes.data?.data) {
        const c = compRes.data.data;
        setComplaint(c);
        setStatusVal(c.status);
        setPriorityVal(c.priority);
        setAssignDeptId(c.departmentId || '');
      }

      if (deptsRes.data?.data) {
        setDepartments(deptsRes.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load complaint');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaintData();
  }, [id]);

  // Handle Status Update
  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    if (statusVal === 'RESOLVED' && (!resolutionDetails || !resolutionDetails.trim())) {
      alert('Resolution details are mandatory when marking a complaint Resolved.');
      return;
    }
    if (statusVal === 'REJECTED' && (!rejectionReason || !rejectionReason.trim())) {
      alert('Rejection reason is mandatory when marking a complaint Rejected.');
      return;
    }

    setStatusLoading(true);
    try {
      const formData = new FormData();
      formData.append('status', statusVal);
      if (statusRemarks) formData.append('remarks', statusRemarks.trim());
      if (resolutionDetails) formData.append('resolutionDetails', resolutionDetails.trim());
      if (rejectionReason) formData.append('rejectionReason', rejectionReason.trim());
      if (resolutionPhoto) formData.append('resolutionPhoto', resolutionPhoto);

      const res = await adminApi.updateStatus(id, formData, true);
      setComplaint(res.data.data);
      setIsStatusOpen(false);
      setSuccessMsg(`Complaint status successfully updated to ${statusVal}`);
      setStatusRemarks('');
      setResolutionDetails('');
      setRejectionReason('');
      setResolutionPhoto(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setStatusLoading(false);
    }
  };

  // Handle Assign
  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!assignDeptId) {
      alert('Please select a department.');
      return;
    }

    setAssignLoading(true);
    try {
      const res = await adminApi.assignComplaint(id, {
        departmentId: assignDeptId,
        assignedOfficerName: officerName.trim(),
        notes: assignNotes.trim(),
      });
      setComplaint(res.data.data);
      setIsAssignOpen(false);
      setSuccessMsg('Complaint successfully assigned.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to assign complaint.');
    } finally {
      setAssignLoading(false);
    }
  };

  // Handle Priority
  const handlePrioritySubmit = async (e) => {
    e.preventDefault();
    setPriorityLoading(true);
    try {
      const res = await adminApi.updatePriority(id, { priority: priorityVal });
      setComplaint(res.data.data);
      setIsPriorityOpen(false);
      setSuccessMsg(`Priority updated to ${priorityVal}.`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update priority.');
    } finally {
      setPriorityLoading(false);
    }
  };

  // Handle Remark
  const handleRemarkSubmit = async (e) => {
    e.preventDefault();
    if (!remarkText.trim()) return;

    setRemarkLoading(true);
    try {
      await adminApi.addRemark(id, {
        remark: remarkText.trim(),
        internalOnly,
      });
      setIsRemarkOpen(false);
      setRemarkText('');
      setSuccessMsg('Administrative remark added.');
      fetchComplaintData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add remark.');
    } finally {
      setRemarkLoading(false);
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
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <Link to="/admin/complaints" className="btn btn-outline btn-sm">
            <ArrowLeft size={16} /> Back to All Complaints
          </Link>

          {/* Quick Action Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button type="button" onClick={() => setIsStatusOpen(true)} className="btn btn-navy btn-sm">
              <CheckCircle2 size={15} /> Update Status
            </button>
            <button type="button" onClick={() => setIsAssignOpen(true)} className="btn btn-outline btn-sm">
              <UserCheck size={15} /> Assign Dept
            </button>
            <button type="button" onClick={() => setIsPriorityOpen(true)} className="btn btn-outline btn-sm">
              <Flag size={15} /> Priority
            </button>
            <button type="button" onClick={() => setIsRemarkOpen(true)} className="btn btn-outline btn-sm">
              <MessageSquare size={15} /> Add Remark
            </button>
          </div>
        </div>

        {successMsg && <Alert type="success" message={successMsg} />}

        {/* Primary Complaint Card */}
        <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '5px solid var(--primary-navy)' }}>
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

            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'right' }}>
              <div>Filed on: <strong>{formatDate(complaint.createdAt)}</strong></div>
              <div>Last updated: <strong>{formatDate(complaint.updatedAt)}</strong></div>
            </div>
          </div>

          <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: '1.6', background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            {complaint.description}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1.25rem', fontSize: '0.88rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>Category</span>
              <strong>{complaint.categoryName}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>Assigned Department</span>
              <strong style={{ color: complaint.departmentName === 'Unassigned' ? '#dc2626' : 'var(--text-main)' }}>
                {complaint.departmentName || 'Unassigned'}
              </strong>
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

        {/* Citizen Information & Field Assignment Card */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {/* Citizen Details */}
          <div className="card">
            <h3 className="card-title" style={{ fontSize: '1.05rem', marginBottom: '1rem' }}>
              <User size={18} color="var(--accent-green)" /> Complainant Resident Info
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <div><strong>Name:</strong> {complaint.citizenName}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Mail size={14} color="var(--text-muted)" />
                <span>{complaint.citizenEmail}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Phone size={14} color="var(--text-muted)" />
                <span>{complaint.citizenPhone}</span>
              </div>
            </div>
          </div>

          {/* Department Assignment Info */}
          <div className="card">
            <h3 className="card-title" style={{ fontSize: '1.05rem', marginBottom: '1rem' }}>
              <Building size={18} color="var(--accent-green)" /> Dispatch & Routing Info
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <div>
                <strong>Department:</strong> {complaint.departmentName || 'Not Assigned'}
              </div>
              <div>
                <strong>Assigned Officer:</strong> {complaint.assignedOfficerName || 'Pending Designation'}
              </div>
              {complaint.assignmentNotes && (
                <div>
                  <strong>Dispatch Notes:</strong> <em>"{complaint.assignmentNotes}"</em>
                </div>
              )}
              {complaint.assignedAt && (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Assigned at: {formatDate(complaint.assignedAt)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Photographic Evidence */}
        {(complaint.imageUrl || complaint.resolutionImageUrl) && (
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 className="card-title">
              <FileImage size={18} /> Photographic Proof & Audit
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

        {/* Resolution Details (if Resolved) */}
        {complaint.status === 'RESOLVED' && (
          <div className="card" style={{ marginBottom: '1.5rem', background: '#f0fdf4', borderColor: '#bbf7d0' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#166534', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <CheckCircle2 size={20} color="#166534" /> Official Resolution Report
            </h3>
            <p style={{ color: '#14532d', fontSize: '0.95rem', lineHeight: '1.6' }}>
              {complaint.resolutionDetails}
            </p>
            <div style={{ fontSize: '0.82rem', color: '#15803d', marginTop: '0.75rem' }}>
              Marked Resolved on: <strong>{formatDate(complaint.resolvedAt)}</strong>
            </div>
          </div>
        )}

        {/* Rejection Details (if Rejected) */}
        {complaint.status === 'REJECTED' && (
          <div className="card" style={{ marginBottom: '1.5rem', background: '#fef2f2', borderColor: '#fecaca' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#991b1b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <XCircle size={20} color="#991b1b" /> Rejection Justification
            </h3>
            <p style={{ color: '#7f1d1d', fontSize: '0.95rem', lineHeight: '1.6' }}>
              {complaint.rejectionReason}
            </p>
          </div>
        )}

        {/* Citizen Rating & Feedback (if any) */}
        {complaint.feedback && (
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 className="card-title">
              <Star size={18} color="#eab308" /> Citizen Satisfaction Feedback
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.5rem' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={18}
                  fill={star <= complaint.feedback.rating ? '#eab308' : 'none'}
                  color={star <= complaint.feedback.rating ? '#eab308' : '#cbd5e1'}
                />
              ))}
              <span style={{ fontWeight: 700, marginLeft: '0.5rem' }}>
                {complaint.feedback.rating} / 5
              </span>
            </div>
            {complaint.feedback.comments && (
              <p style={{ fontStyle: 'italic', marginTop: '0.5rem', color: 'var(--text-main)', fontSize: '0.92rem' }}>
                "{complaint.feedback.comments}"
              </p>
            )}
          </div>
        )}

        {/* Administrative Remarks */}
        {complaint.remarks && complaint.remarks.length > 0 && (
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 className="card-title">
              <MessageSquare size={18} /> Internal / Administrative Remarks
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.75rem' }}>
              {complaint.remarks.map((r) => (
                <div key={r.id} style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                    <span><strong>{r.adminName}</strong> {r.internalOnly && <span style={{ color: '#dc2626', fontWeight: 600 }}>[Internal Only]</span>}</span>
                    <span>{formatDate(r.createdAt)}</span>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{r.remark}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="card">
          <h3 className="card-title">
            <Clock size={18} /> Complete Status Audit Trail
          </h3>
          <Timeline history={complaint.history} />
        </div>

        {/* Modal 1: Update Status */}
        <Modal
          isOpen={isStatusOpen}
          onClose={() => setIsStatusOpen(false)}
          title="Update Complaint Status"
        >
          <form onSubmit={handleStatusSubmit}>
            <div className="form-group">
              <label className="form-label">New Status</label>
              <select
                value={statusVal}
                onChange={(e) => setStatusVal(e.target.value)}
                className="form-control"
              >
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved (Issue Fixed)</option>
                <option value="REJECTED">Rejected (Invalid/Duplicate)</option>
              </select>
            </div>

            {statusVal === 'RESOLVED' && (
              <>
                <div className="form-group">
                  <label className="form-label">
                    Resolution Details <span className="required">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    className="form-control"
                    placeholder="Describe how the problem was remediated (e.g., cleared 2 tons of waste, patched 4 square meters with asphalt...)"
                    value={resolutionDetails}
                    onChange={(e) => setResolutionDetails(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Upload Resolution Photograph (Optional)</label>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={(e) => setResolutionPhoto(e.target.files[0])}
                    className="form-control"
                  />
                  <div className="form-text">Proof of completion visible to citizens.</div>
                </div>
              </>
            )}

            {statusVal === 'REJECTED' && (
              <div className="form-group">
                <label className="form-label">
                  Rejection Reason <span className="required">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  className="form-control"
                  placeholder="State clear official reason why this complaint is invalid, out of municipal jurisdiction, or a duplicate..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Administrative Remarks / Action Log</label>
              <input
                type="text"
                className="form-control"
                placeholder="Optional remarks recorded in timeline..."
                value={statusRemarks}
                onChange={(e) => setStatusRemarks(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" onClick={() => setIsStatusOpen(false)} className="btn btn-outline" disabled={statusLoading}>
                Cancel
              </button>
              <button type="submit" className="btn btn-navy" disabled={statusLoading}>
                <CheckCircle2 size={16} /> {statusLoading ? 'Updating...' : 'Save Status Update'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Modal 2: Assign Department */}
        <Modal
          isOpen={isAssignOpen}
          onClose={() => setIsAssignOpen(false)}
          title="Assign Department & Officer"
        >
          <form onSubmit={handleAssignSubmit}>
            <div className="form-group">
              <label className="form-label">
                Department <span className="required">*</span>
              </label>
              <select
                required
                value={assignDeptId}
                onChange={(e) => setAssignDeptId(e.target.value)}
                className="form-control"
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Assigned Officer / Field In-charge</label>
              <input
                type="text"
                placeholder="e.g. Inspector S. Sharma"
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Dispatch Instructions / Notes</label>
              <textarea
                rows={2}
                placeholder="Specific instructions for the crew..."
                value={assignNotes}
                onChange={(e) => setAssignNotes(e.target.value)}
                className="form-control"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" onClick={() => setIsAssignOpen(false)} className="btn btn-outline" disabled={assignLoading}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={assignLoading}>
                <UserCheck size={16} /> {assignLoading ? 'Assigning...' : 'Confirm Assignment'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Modal 3: Update Priority */}
        <Modal
          isOpen={isPriorityOpen}
          onClose={() => setIsPriorityOpen(false)}
          title="Set Complaint Priority"
        >
          <form onSubmit={handlePrioritySubmit}>
            <div className="form-group">
              <label className="form-label">Priority Level</label>
              <select
                value={priorityVal}
                onChange={(e) => setPriorityVal(e.target.value)}
                className="form-control"
              >
                <option value="LOW">Low (Routine maintenance)</option>
                <option value="MEDIUM">Medium (Standard queue)</option>
                <option value="HIGH">High (Impacting traffic / public health)</option>
                <option value="URGENT">Urgent (Immediate safety hazard)</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" onClick={() => setIsPriorityOpen(false)} className="btn btn-outline" disabled={priorityLoading}>
                Cancel
              </button>
              <button type="submit" className="btn btn-navy" disabled={priorityLoading}>
                <Flag size={16} /> {priorityLoading ? 'Saving...' : 'Set Priority'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Modal 4: Add Remark */}
        <Modal
          isOpen={isRemarkOpen}
          onClose={() => setIsRemarkOpen(false)}
          title="Add Administrative Remark"
        >
          <form onSubmit={handleRemarkSubmit}>
            <div className="form-group">
              <label className="form-label">Remark Notes</label>
              <textarea
                required
                rows={3}
                placeholder="Enter internal inspection note or progress remark..."
                value={remarkText}
                onChange={(e) => setRemarkText(e.target.value)}
                className="form-control"
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={internalOnly}
                  onChange={(e) => setInternalOnly(e.target.checked)}
                />
                <span>Internal Only (Hide from citizen)</span>
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" onClick={() => setIsRemarkOpen(false)} className="btn btn-outline" disabled={remarkLoading}>
                Cancel
              </button>
              <button type="submit" className="btn btn-navy" disabled={remarkLoading}>
                <Save size={16} /> {remarkLoading ? 'Saving...' : 'Save Remark'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};
