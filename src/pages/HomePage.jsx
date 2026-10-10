import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { publicApi } from '../api';
import { 
  Building2, 
  FilePlus2, 
  Search, 
  CheckCircle2, 
  Clock, 
  Users, 
  ShieldAlert, 
  ChevronRight, 
  Trash2, 
  Car, 
  Waves, 
  Lightbulb, 
  Droplets, 
  Trees, 
  HelpCircle,
  ArrowRight
} from 'lucide-react';

const iconMap = {
  Trash2,
  Car,
  Waves,
  Lightbulb,
  Droplets,
  Trees,
};

export const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [trackNumber, setTrackNumber] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    publicApi.getCategories()
      .then((res) => {
        if (res.data && res.data.data) {
          setCategories(res.data.data);
        }
      })
      .catch((err) => console.error('Failed to load categories', err));
  }, []);

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (trackNumber.trim()) {
      navigate(`/track?id=${encodeURIComponent(trackNumber.trim())}`);
    }
  };

  return (
    <div>
      {/* Hero Banner */}
      <section className="hero-section">
        <div className="container">
          <span style={{ 
            display: 'inline-block', 
            background: 'rgba(16, 185, 129, 0.2)', 
            color: 'var(--accent-green)', 
            padding: '0.3rem 0.9rem', 
            borderRadius: '999px', 
            fontSize: '0.85rem', 
            fontWeight: 700, 
            marginBottom: '1.25rem',
            border: '1px solid rgba(16, 185, 129, 0.4)'
          }}>
            Official Civic Redressal Portal
          </span>
          <h1 className="hero-title">
            Smart Municipal Issue Reporting & <span>Management System</span>
          </h1>
          <p className="hero-subtitle">
            Empowering residents to report civic problems directly to city authorities. Track resolutions in real time with 100% transparency and verified accountability.
          </p>

          <div className="hero-buttons">
            <Link to="/citizen/submit" className="btn btn-primary btn-lg">
              <FilePlus2 size={20} /> Report an Issue Now
            </Link>
            <Link to="/track" className="btn btn-outline-white btn-lg">
              <Search size={20} /> Track Complaint
            </Link>
          </div>

          {/* Quick Track Input Bar */}
          <div style={{ maxWidth: '580px', margin: '2.5rem auto 0', background: 'rgba(255, 255, 255, 0.12)', padding: '0.5rem', borderRadius: 'var(--radius-md)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
            <form onSubmit={handleTrackSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="Enter Complaint ID (e.g. MUNIC-2026-0001)"
                value={trackNumber}
                onChange={(e) => setTrackNumber(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.95rem',
                  outline: 'none',
                }}
              />
              <button type="submit" className="btn btn-primary">
                Track <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section style={{ padding: '3.5rem 0', background: '#ffffff', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.85rem', color: 'var(--primary-navy)', fontWeight: 800 }}>
              How the System Works
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0.5rem auto 0' }}>
              A closed-loop grievance lifecycle ensuring every reported issue is addressed and audited.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', background: '#dbeafe', color: '#1e40af', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <FilePlus2 size={26} />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--primary-navy)' }}>1. Submit Grievance</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Upload photos of the problem, specify locality and address, and receive a permanent unique Complaint ID.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', background: '#ede9fe', color: '#6d28d9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Clock size={26} />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--primary-navy)' }}>2. Review & Assign</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Municipal administrators verify complaints and dispatch them to the responsible field department.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', background: '#fef3c7', color: '#b45309', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <CheckCircle2 size={26} />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--primary-navy)' }}>3. Field Resolution</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Municipal crew performs repairs on ground, records proof of resolution, and uploads fixed photograph.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', background: '#d1fae5', color: '#047857', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Users size={26} />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--primary-navy)' }}>4. Citizen Feedback</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Rate resolution quality or reopen the complaint if the problem persists on ground.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section style={{ padding: '3.5rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.85rem', color: 'var(--primary-navy)', fontWeight: 800 }}>
                Municipal Issue Categories
              </h2>
              <p style={{ color: 'var(--text-muted)' }}>
                Select an issue category to report problems directly to the designated department.
              </p>
            </div>
            <Link to="/categories" className="btn btn-outline btn-sm">
              View All <ChevronRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {categories.map((cat) => {
              const IconComp = iconMap[cat.icon] || ShieldAlert;
              return (
                <div key={cat.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div style={{ background: '#f1f5f9', color: 'var(--primary-navy)', width: '42px', height: '42px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IconComp size={22} />
                      </div>
                      <h4 style={{ fontSize: '1.05rem', color: 'var(--primary-navy)', fontWeight: 700 }}>
                        {cat.name}
                      </h4>
                    </div>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '1.25rem' }}>
                      {cat.description}
                    </p>
                  </div>
                  <Link 
                    to={`/citizen/submit?categoryId=${cat.id}`} 
                    className="btn btn-outline btn-sm" 
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    Report Issue <ChevronRight size={14} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section style={{ padding: '3rem 0', background: 'var(--primary-navy)', color: '#ffffff' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Are you experiencing an unresolved civic issue?
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              Create an account or login to file a complaint in less than 2 minutes.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/register" className="btn btn-primary">
              Register as Citizen
            </Link>
            <Link to="/login" className="btn btn-outline-white">
              Log In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
