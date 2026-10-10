import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Building, Send, CheckCircle2 } from 'lucide-react';
import { Alert } from '../components/Alert';

export const ContactPage = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ color: 'var(--accent-green)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>
          Municipal Citizen Support
        </span>
        <h1 style={{ fontSize: '2.4rem', color: 'var(--primary-navy)', fontWeight: 800, marginTop: '0.25rem' }}>
          Civic Helpline & Contact Directory
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0.5rem auto 0' }}>
          Reach out to municipal administrative cells, emergency hotlines, and ward offices.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Contact Information Cards */}
        <div>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-navy)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building size={20} color="var(--accent-green)" /> Central Administration HQ
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.92rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <MapPin size={18} color="var(--accent-green)" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                <div>
                  <strong>Municipal Corporation Headquarters</strong>
                  <p style={{ color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    Civic Center, Dr. B.R. Ambedkar Veedhi, Sector 1, Central City
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Phone size={18} color="var(--accent-green)" style={{ flexShrink: 0 }} />
                <div>
                  <strong>Toll-Free Civic Helpline:</strong> <span style={{ color: 'var(--accent-green-dark)', fontWeight: 700 }}>1800-425-0011</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Mail size={18} color="var(--accent-green)" style={{ flexShrink: 0 }} />
                <div>
                  <strong>Official Email:</strong> contact@municipal.gov
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Clock size={18} color="var(--accent-green)" style={{ flexShrink: 0 }} />
                <div>
                  <strong>Control Room Hours:</strong> 24/7 Redressal Monitoring
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h4 style={{ fontSize: '1.05rem', color: 'var(--primary-navy)', marginBottom: '0.75rem' }}>
              Emergency Civic Numbers
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.88rem' }}>
              <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                <strong>Water Supply Leakage:</strong>
                <p style={{ color: 'var(--accent-green-dark)', fontWeight: 600 }}>080-2222-1100</p>
              </div>
              <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                <strong>Drainage & Sewage Cell:</strong>
                <p style={{ color: 'var(--accent-green-dark)', fontWeight: 600 }}>080-2222-2200</p>
              </div>
              <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                <strong>Streetlight Repair Cell:</strong>
                <p style={{ color: 'var(--accent-green-dark)', fontWeight: 600 }}>080-2222-3300</p>
              </div>
              <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                <strong>Solid Waste Emergency:</strong>
                <p style={{ color: 'var(--accent-green-dark)', fontWeight: 600 }}>080-2222-4400</p>
              </div>
            </div>
          </div>
        </div>

        {/* Citizen Query Form */}
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-navy)', marginBottom: '0.5rem' }}>
            Send General Inquiry
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
            For filing grievances, please use the <a href="/citizen/submit" style={{ color: 'var(--accent-green)', textDecoration: 'underline' }}>Report Issue form</a>. For administrative queries, use this form.
          </p>

          {formSubmitted && (
            <Alert 
              type="success" 
              message="Thank you! Your message has been routed to the Municipal Public Relations desk." 
            />
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Your Name</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="Rajesh Kumar"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                required
                className="form-control"
                placeholder="rajesh@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Subject</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="Ward 12 Sanitation Schedule Query"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea
                required
                rows={4}
                className="form-control"
                placeholder="Describe your query..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <Send size={16} /> Submit Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
