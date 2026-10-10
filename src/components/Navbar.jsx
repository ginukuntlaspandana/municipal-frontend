import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  Home, 
  Info, 
  ListCheck, 
  HelpCircle, 
  Search, 
  Phone, 
  PlusCircle, 
  LayoutDashboard, 
  User, 
  LogOut, 
  ShieldAlert, 
  BarChart3, 
  Building, 
  MessageSquareQuote 
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isCitizen, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <Link to="/" className="nav-brand">
        <div className="nav-brand-logo">
          <Building2 size={22} />
        </div>
        <div>
          <span>SmartMunicipal</span>
          <span style={{ fontSize: '0.72rem', display: 'block', color: 'var(--accent-green)', fontWeight: 600 }}>
            Civic Issue Management
          </span>
        </div>
      </Link>

      <nav className="nav-links">
        {/* Public Navigation */}
        <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Home size={16} /> Home
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Info size={16} /> About
        </NavLink>
        <NavLink to="/categories" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <ListCheck size={16} /> Categories
        </NavLink>
        <NavLink to="/how-it-works" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <HelpCircle size={16} /> How It Works
        </NavLink>
        <NavLink to="/track" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Search size={16} /> Track Issue
        </NavLink>
        <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Phone size={16} /> Contact
        </NavLink>

        {/* Citizen Navigation Links */}
        {isAuthenticated && isCitizen && (
          <>
            <NavLink to="/citizen/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={16} /> Dashboard
            </NavLink>
            <NavLink to="/citizen/submit" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <PlusCircle size={16} /> Report Issue
            </NavLink>
            <NavLink to="/citizen/complaints" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <ListCheck size={16} /> My Complaints
            </NavLink>
          </>
        )}

        {/* Admin Navigation Links */}
        {isAuthenticated && isAdmin && (
          <>
            <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={16} /> Admin Portal
            </NavLink>
            <NavLink to="/admin/complaints" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <ShieldAlert size={16} /> Complaints
            </NavLink>
            <NavLink to="/admin/departments" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Building size={16} /> Departments
            </NavLink>
            <NavLink to="/admin/reports" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <BarChart3 size={16} /> Reports
            </NavLink>
            <NavLink to="/admin/feedback" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <MessageSquareQuote size={16} /> Feedback
            </NavLink>
          </>
        )}
      </nav>

      <div className="nav-actions">
        {isAuthenticated ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/profile" className="user-pill" title="View Profile">
              <User size={15} color="var(--accent-green)" />
              <span style={{ fontWeight: 600 }}>{user?.fullName?.split(' ')[0]}</span>
              <span className="role-tag">{isAdmin ? 'Admin' : 'Citizen'}</span>
            </Link>
            <button 
              onClick={handleLogout} 
              className="btn btn-outline-white btn-sm" 
              title="Sign Out"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to="/login" className="btn btn-outline-white btn-sm">
              Log In
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
