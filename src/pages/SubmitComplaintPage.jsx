import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { complaintApi, publicApi } from '../api';
import { Alert } from '../components/Alert';
import { 
  FilePlus2, 
  Upload, 
  X, 
  MapPin, 
  Building, 
  CheckCircle2, 
  ArrowRight, 
  AlertCircle 
} from 'lucide-react';

export const SubmitComplaintPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: searchParams.get('categoryId') || '',
    locality: '',
    address: '',
    landmark: '',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successComplaint, setSuccessComplaint] = useState(null);

  useEffect(() => {
    publicApi.getCategories()
      .then((res) => {
        if (res.data && res.data.data) {
          setCategories(res.data.data);
          if (!formData.categoryId && res.data.data.length > 0) {
            setFormData((prev) => ({ ...prev, categoryId: res.data.data[0].id }));
          }
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size exceeds 10MB limit');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || formData.title.trim().length < 5) {
      setError('Title must be at least 5 characters long');
      return;
    }

    if (!formData.description || formData.description.trim().length < 10) {
      setError('Description must be at least 10 characters long');
      return;
    }

    if (!formData.categoryId) {
      setError('Please select an issue category');
      return;
    }

    if (!formData.locality.trim() || !formData.address.trim()) {
      setError('Locality and detailed address are mandatory');
      return;
    }

    setSubmitting(true);

    try {
      const data = new FormData();
      data.append('title', formData.title.trim());
      data.append('description', formData.description.trim());
      data.append('categoryId', formData.categoryId);
      data.append('locality', formData.locality.trim());
      data.append('address', formData.address.trim());
      if (formData.landmark) {
        data.append('landmark', formData.landmark.trim());
      }
      if (selectedFile) {
        data.append('image', selectedFile);
      }

      const res = await complaintApi.create(data);
      if (res.data && res.data.data) {
        setSuccessComplaint(res.data.data);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit complaint. Please check the fields and try again.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (successComplaint) {
    return (
      <div className="container" style={{ padding: '3.5rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
        <div className="card" style={{ maxWidth: '600px', width: '100%', textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{ width: '64px', height: '64px', background: '#d1fae5', color: '#047857', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <CheckCircle2 size={36} />
          </div>

          <span style={{ color: 'var(--accent-green-dark)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>
            Submission Successful
          </span>
          <h2 style={{ fontSize: '1.85rem', color: 'var(--primary-navy)', fontWeight: 800, marginTop: '0.25rem', marginBottom: '1rem' }}>
            Grievance Lodged Successfully!
          </h2>

          <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border-color)', margin: '1.5rem 0' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'block' }}>
              Your Unique Complaint ID
            </span>
            <span style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary-navy)', fontFamily: 'monospace' }}>
              {successComplaint.complaintNumber}
            </span>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Please save this ID to track live field status or communicate with municipal officers.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to={`/citizen/complaints/${successComplaint.id}`} className="btn btn-primary">
              View Complaint Details <ArrowRight size={16} />
            </Link>
            <button
              type="button"
              onClick={() => {
                setSuccessComplaint(null);
                setFormData({
                  title: '',
                  description: '',
                  categoryId: categories[0]?.id || '',
                  locality: '',
                  address: '',
                  landmark: '',
                });
                removeFile();
              }}
              className="btn btn-outline"
            >
              Lodge Another Complaint
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: '780px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <span style={{ color: 'var(--accent-green-dark)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>
            Civic Issue Reporting
          </span>
          <h1 style={{ fontSize: '2.2rem', color: 'var(--primary-navy)', fontWeight: 800 }}>
            Lodge a Municipal Complaint
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Provide accurate details, exact location, and photograph for expedited municipal action.
          </p>
        </div>

        {error && <Alert type="error" message={error} />}

        <div className="card">
          <form onSubmit={handleSubmit}>
            {/* Category */}
            <div className="form-group">
              <label className="form-label">
                Problem Category <span className="required">*</span>
              </label>
              <select
                name="categoryId"
                required
                className="form-control"
                value={formData.categoryId}
                onChange={handleChange}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <div className="form-text">Selecting the right category routes the issue directly to that department.</div>
            </div>

            {/* Title */}
            <div className="form-group">
              <label className="form-label">
                Complaint Title <span className="required">*</span>
              </label>
              <input
                type="text"
                required
                name="title"
                className="form-control"
                placeholder="e.g. Deep Pothole on 4th Main Road near School"
                value={formData.title}
                onChange={handleChange}
              />
              <div className="form-text">Brief, clear summary of the issue (min 5 characters).</div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">
                Detailed Description <span className="required">*</span>
              </label>
              <textarea
                required
                rows={4}
                name="description"
                className="form-control"
                placeholder="Explain the problem in detail (how severe it is, danger to commuters, how long it has existed, etc.)"
                value={formData.description}
                onChange={handleChange}
              />
              <div className="form-text">Minimum 10 characters.</div>
            </div>

            {/* Location Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">
                  Locality / Ward / Area <span className="required">*</span>
                </label>
                <input
                  type="text"
                  required
                  name="locality"
                  className="form-control"
                  placeholder="e.g. Indiranagar, Ward 72"
                  value={formData.locality}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Nearby Landmark (Optional)</label>
                <input
                  type="text"
                  name="landmark"
                  className="form-control"
                  placeholder="e.g. Opposite City Hospital / Metro Gate 1"
                  value={formData.landmark}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Street Address / Location Details <span className="required">*</span>
              </label>
              <input
                type="text"
                required
                name="address"
                className="form-control"
                placeholder="e.g. 5th Cross, Between House #24 and #28"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            {/* Photo Upload Section */}
            <div className="form-group">
              <label className="form-label">Photograph of the Issue (JPG, PNG, max 10MB)</label>
              
              {!previewUrl ? (
                <div style={{ 
                  border: '2px dashed var(--border-color)', 
                  borderRadius: 'var(--radius-sm)', 
                  padding: '2rem', 
                  textAlign: 'center', 
                  background: '#f8fafc',
                  cursor: 'pointer',
                  position: 'relative',
                }}>
                  <Upload size={32} color="var(--accent-green)" style={{ margin: '0 auto 0.5rem' }} />
                  <p style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--primary-navy)' }}>
                    Click to browse or drop an image file here
                  </p>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Visual proof speeds up verification and field crew dispatch
                  </span>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    onChange={handleFileChange}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      opacity: 0,
                      cursor: 'pointer',
                    }}
                  />
                </div>
              ) : (
                <div style={{ position: 'relative', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border-color)', maxWidth: '320px' }}>
                  <img
                    src={previewUrl}
                    alt="Uploaded preview"
                    style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }}
                  />
                  <button
                    type="button"
                    onClick={removeFile}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: 'rgba(0, 0, 0, 0.7)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '50%',
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                    title="Remove Photo"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
              <button
                type="button"
                onClick={() => navigate('/citizen/dashboard')}
                className="btn btn-outline"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={submitting}
              >
                <FilePlus2 size={20} /> {submitting ? 'Submitting Grievance...' : 'Submit Complaint'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
