import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../api';
import { Alert } from '../components/Alert';
import { User, Lock, Save, ShieldCheck } from 'lucide-react';

export const ProfilePage = () => {
  const { user, refreshUser } = useAuth();

  const [profileData, setProfileData] = useState({
    fullName: '',
    phone: '',
    address: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  const [passLoading, setPassLoading] = useState(false);
  const [passSuccess, setPassSuccess] = useState('');
  const [passError, setPassError] = useState('');

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    setProfileLoading(true);

    try {
      await userApi.updateProfile(profileData);
      setProfileSuccess('Profile details updated successfully');
      refreshUser();
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPassError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPassError('New password must be at least 6 characters');
      return;
    }

    setPassLoading(true);

    try {
      await userApi.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPassSuccess('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPassError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <span style={{ color: 'var(--accent-green-dark)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>
            Account Settings
          </span>
          <h1 style={{ fontSize: '2.2rem', color: 'var(--primary-navy)', fontWeight: 800 }}>
            User Profile & Security
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Manage your personal contact details and password credentials.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
          {/* Profile Edit Card */}
          <div className="card">
            <h2 className="card-title" style={{ marginBottom: '1.25rem' }}>
              <User size={20} color="var(--accent-green)" /> Personal Details
            </h2>

            {profileSuccess && <Alert type="success" message={profileSuccess} />}
            {profileError && <Alert type="error" message={profileError} />}

            <form onSubmit={handleProfileSubmit}>
              <div className="form-group">
                <label className="form-label">Email Address (Read-only)</label>
                <input
                  type="email"
                  disabled
                  className="form-control"
                  value={user?.email || ''}
                  style={{ background: '#f8fafc', color: 'var(--text-muted)' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Full Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={profileData.fullName}
                  onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Mobile Phone Number <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  required
                  className="form-control"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Resident Address / Locality</label>
                <textarea
                  rows={2}
                  className="form-control"
                  value={profileData.address}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={profileLoading} style={{ width: '100%' }}>
                <Save size={16} /> {profileLoading ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>

          {/* Password Change Card */}
          <div className="card">
            <h2 className="card-title" style={{ marginBottom: '1.25rem' }}>
              <Lock size={20} color="var(--accent-green)" /> Change Password
            </h2>

            {passSuccess && <Alert type="success" message={passSuccess} />}
            {passError && <Alert type="error" message={passError} />}

            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label className="form-label">
                  Current Password <span className="required">*</span>
                </label>
                <input
                  type="password"
                  required
                  className="form-control"
                  placeholder="••••••••"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  New Password <span className="required">*</span>
                </label>
                <input
                  type="password"
                  required
                  className="form-control"
                  placeholder="At least 6 characters"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Confirm New Password <span className="required">*</span>
                </label>
                <input
                  type="password"
                  required
                  className="form-control"
                  placeholder="Re-enter new password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-navy" disabled={passLoading} style={{ width: '100%' }}>
                <ShieldCheck size={16} /> {passLoading ? 'Updating Password...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
