import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-col">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#ffffff', marginBottom: '0.8rem' }}>
            <Building2 size={24} color="var(--accent-green)" />
            <strong style={{ fontSize: '1.15rem' }}>SmartMunicipal</strong>
          </div>
          <p style={{ fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '1rem' }}>
            Digital governance initiative connecting citizens with local municipal authorities for transparent grievance redressal and urban maintenance.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--accent-green)' }}>
            <ShieldCheck size={16} /> Certified Official Municipal Portal
          </div>
        </div>

        <div className="footer-col">
          <h4>Civic Services</h4>
          <ul>
            <li><Link to="/citizen/submit">Report Waste Accumulation</Link></li>
            <li><Link to="/citizen/submit">Pothole & Road Repair</Link></li>
            <li><Link to="/citizen/submit">Water Supply Pipeline Issues</Link></li>
            <li><Link to="/citizen/submit">Streetlight Outage</Link></li>
            <li><Link to="/track">Track Complaint Status</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/about">About the System</Link></li>
            <li><Link to="/how-it-works">How Workflow Works</Link></li>
            <li><Link to="/categories">Issue Categories</Link></li>
            <li><Link to="/login">Citizen / Admin Login</Link></li>
            <li><Link to="/contact">Help & Support Directory</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Civic Control Room</h4>
          <ul>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Phone size={15} color="var(--accent-green)" />
              Toll-Free Helpline: 1800-425-0011
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={15} color="var(--accent-green)" />
              support@municipal.gov
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <MapPin size={15} color="var(--accent-green)" style={{ marginTop: '0.2rem', flexShrink: 0 }} />
              Municipal Corporation Headquarters, Civic Center, Sector 1
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} Smart Municipal Issue Reporting and Management System. Designed for civic transparency and accountability.
        </p>
      </div>
    </footer>
  );
};
