import React, { useEffect, useState } from 'react';
import { adminApi } from '../api';
import { Modal } from '../components/Modal';
import { Alert } from '../components/Alert';
import { Loader } from '../components/Loader';
import { Building, PlusCircle, Mail, Phone, CheckCircle2, ShieldCheck } from 'lucide-react';

export const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', code: '', contactEmail: '', contactPhone: '' });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getDepartments();
      if (res.data?.data) {
        setDepartments(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    try {
      await adminApi.createDepartment(formData);
      setIsAddOpen(false);
      setFormData({ name: '', code: '', contactEmail: '', contactPhone: '' });
      setSuccessMsg('Department created successfully');
      fetchDepartments();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to create department');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ color: 'var(--accent-green-dark)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>
            Organizational Structure
          </span>
          <h1 style={{ fontSize: '2.2rem', color: 'var(--primary-navy)', fontWeight: 800 }}>
            Municipal Departments
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Specialized municipal divisions responsible for addressing assigned grievances.
          </p>
        </div>

        <button type="button" onClick={() => setIsAddOpen(true)} className="btn btn-primary">
          <PlusCircle size={16} /> Add Department
        </button>
      </div>

      {successMsg && <Alert type="success" message={successMsg} />}

      {loading ? (
        <Loader text="Loading departments..." />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {departments.map((d) => (
            <div key={d.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '42px', height: '42px', background: '#e0f2fe', color: '#0369a1', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Building size={22} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-navy)', fontWeight: 700 }}>
                        {d.name}
                      </h3>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', background: '#f1f5f9', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>
                        CODE: {d.code}
                      </span>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', background: d.active ? '#d1fae5' : '#fee2e2', color: d.active ? '#065f46' : '#991b1b', padding: '0.2rem 0.5rem', borderRadius: '999px', fontWeight: 700 }}>
                    {d.active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Mail size={14} color="var(--accent-green)" />
                    <span>{d.contactEmail || 'No email registered'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Phone size={14} color="var(--accent-green)" />
                    <span>{d.contactPhone || 'No phone registered'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Department Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Create New Municipal Department"
      >
        {errorMsg && <Alert type="error" message={errorMsg} />}

        <form onSubmit={handleAddSubmit}>
          <div className="form-group">
            <label className="form-label">Department Name <span className="required">*</span></label>
            <input
              type="text"
              required
              placeholder="e.g. Traffic & Signal Management"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Department Code <span className="required">*</span></label>
            <input
              type="text"
              required
              placeholder="e.g. TSM"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              className="form-control"
              style={{ textTransform: 'uppercase' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contact Email</label>
            <input
              type="email"
              placeholder="traffic.dept@municipal.gov"
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contact Helpline Phone</label>
            <input
              type="tel"
              placeholder="+91 98765 00000"
              value={formData.contactPhone}
              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              className="form-control"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" onClick={() => setIsAddOpen(false)} className="btn btn-outline" disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              <CheckCircle2 size={16} /> {submitting ? 'Creating...' : 'Create Department'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
