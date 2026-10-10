import React, { useEffect, useState } from 'react';
import { adminApi } from '../api';
import { Modal } from '../components/Modal';
import { Alert } from '../components/Alert';
import { Loader } from '../components/Loader';
import { 
  Layers, 
  PlusCircle, 
  CheckCircle2, 
  Trash2, 
  Car, 
  Waves, 
  Lightbulb, 
  Droplets, 
  Trees, 
  ShieldAlert 
} from 'lucide-react';

const iconMap = {
  Trash2,
  Car,
  Waves,
  Lightbulb,
  Droplets,
  Trees,
};

export const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', icon: 'AlertCircle' });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getCategories();
      if (res.data?.data) {
        setCategories(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    try {
      await adminApi.createCategory(formData);
      setIsAddOpen(false);
      setFormData({ name: '', description: '', icon: 'AlertCircle' });
      setSuccessMsg('Category created successfully');
      fetchCategories();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to create category');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ color: 'var(--accent-green-dark)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>
            Issue Classifications
          </span>
          <h1 style={{ fontSize: '2.2rem', color: 'var(--primary-navy)', fontWeight: 800 }}>
            Manage Categories
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Configure municipal issue categories and user reporting classifications.
          </p>
        </div>

        <button type="button" onClick={() => setIsAddOpen(true)} className="btn btn-primary">
          <PlusCircle size={16} /> Add Category
        </button>
      </div>

      {successMsg && <Alert type="success" message={successMsg} />}

      {loading ? (
        <Loader text="Loading categories..." />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {categories.map((c) => {
            const IconComp = iconMap[c.icon] || ShieldAlert;
            return (
              <div key={c.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '42px', height: '42px', background: '#ecfdf5', color: 'var(--accent-green-dark)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IconComp size={22} />
                      </div>
                      <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-navy)', fontWeight: 700 }}>
                        {c.name}
                      </h3>
                    </div>
                    <span style={{ fontSize: '0.75rem', background: c.active ? '#d1fae5' : '#fee2e2', color: c.active ? '#065f46' : '#991b1b', padding: '0.2rem 0.5rem', borderRadius: '999px', fontWeight: 700 }}>
                      {c.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.5rem', lineHeight: '1.5' }}>
                    {c.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Category Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Create New Issue Category"
      >
        {errorMsg && <Alert type="error" message={errorMsg} />}

        <form onSubmit={handleAddSubmit}>
          <div className="form-group">
            <label className="form-label">Category Name <span className="required">*</span></label>
            <input
              type="text"
              required
              placeholder="e.g. Stray Animal Management"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              rows={2}
              placeholder="Explain the issues included in this category..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Icon Identifier</label>
            <select
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="form-control"
            >
              <option value="Trash2">Trash / Waste (Trash2)</option>
              <option value="Car">Roads / Potholes (Car)</option>
              <option value="Waves">Drainage / Sewage (Waves)</option>
              <option value="Lightbulb">Streetlights (Lightbulb)</option>
              <option value="Droplets">Water Supply (Droplets)</option>
              <option value="Trees">Public Parks / Maintenance (Trees)</option>
              <option value="ShieldAlert">General Alert (ShieldAlert)</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" onClick={() => setIsAddOpen(false)} className="btn btn-outline" disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              <CheckCircle2 size={16} /> {submitting ? 'Creating...' : 'Create Category'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
