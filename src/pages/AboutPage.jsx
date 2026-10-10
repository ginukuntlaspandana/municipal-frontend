import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ShieldCheck, Cpu, Users, Layers, Award } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ color: 'var(--accent-green)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>
            About the Project
          </span>
          <h1 style={{ fontSize: '2.4rem', color: 'var(--primary-navy)', fontWeight: 800, marginTop: '0.25rem' }}>
            Smart Municipal Issue Reporting & Management System
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginTop: '0.5rem' }}>
            A next-generation e-governance platform designed for transparent, accountable, and responsive civic administration.
          </p>
        </div>

        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.35rem', color: 'var(--primary-navy)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 size={22} color="var(--accent-green)" /> Purpose & Civic Mission
          </h2>
          <p style={{ color: 'var(--text-main)', lineHeight: '1.7', marginBottom: '1rem' }}>
            In traditional municipal workflows, citizen complaints regarding broken roads, overflowing waste containers, malfunctioning streetlights, and drainage issues are often lost in bureaucratic queues or lack clear accountability.
          </p>
          <p style={{ color: 'var(--text-main)', lineHeight: '1.7' }}>
            The <strong>Smart Municipal Issue Reporting and Management System</strong> bridges the gap between citizens and municipal administrators by providing a real-time, digital pipeline. Citizens receive auditable tracking numbers, photographic proof of progress, and the ability to give direct feedback or reopen issues if they are not satisfied.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-navy)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={20} color="var(--accent-green)" /> For Citizens
            </h3>
            <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.7' }}>
              <li>Instant complaint submission with photos & landmarks</li>
              <li>Real-time status tracking via unique Complaint ID</li>
              <li>SMS/in-app audit history of actions taken</li>
              <li>Direct rating & feedback upon issue resolution</li>
              <li>Transparent right to reopen unresolved issues</li>
            </ul>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-navy)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={20} color="var(--accent-green)" /> For Municipal Authorities
            </h3>
            <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.7' }}>
              <li>Centralized administrative command dashboard</li>
              <li>Multi-tier status transitions with mandatory resolution proof</li>
              <li>Departmental routing and officer assignment</li>
              <li>Priority classification (Low, Medium, High, Urgent)</li>
              <li>Real MySQL analytics, locality heat maps, and CSV exports</li>
            </ul>
          </div>
        </div>

        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.35rem', color: 'var(--primary-navy)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Cpu size={22} color="var(--accent-green)" /> Technology Stack & Architecture
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <strong>Frontend</strong>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                React.js, Vite, React Router 6, Axios, Chart.js, Lucide Icons, Responsive CSS
              </p>
            </div>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <strong>Backend</strong>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                Java 21, Spring Boot 3.3, Spring Web REST, Hibernate JPA, Bean Validation
              </p>
            </div>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <strong>Security & Database</strong>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                Spring Security 6, JWT, BCrypt, MySQL 8/9 with Relational Integrity & Cascades
              </p>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Link to="/citizen/submit" className="btn btn-primary" style={{ marginRight: '0.75rem' }}>
            Report an Issue
          </Link>
          <Link to="/track" className="btn btn-outline">
            Track Existing Issue
          </Link>
        </div>
      </div>
    </div>
  );
};
