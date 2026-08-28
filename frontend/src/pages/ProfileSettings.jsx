import React, { useState } from 'react';
import { usePetly } from '../context/PetlyContext';
import { Sidebar } from '../components/Sidebar';
import { FormInput } from '../components/FormInput';
import { Button } from '../components/Button';
import { User, Mail, Phone, MapPin, Save, RefreshCw, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const ProfileSettings = () => {
  const { user, updateUserProfile, resetAllData } = usePetly();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '742 Evergreen Terrace, Springfield',
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUserProfile(formData);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)' }}>Profile Settings</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Manage your personal contact details, preferences, and data options.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }}>
          
          {/* User Details Form */}
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
              Personal Information
            </h3>

            <form onSubmit={handleSubmit}>
              <FormInput
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                icon={User}
                required
              />

              <FormInput
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                icon={Mail}
                required
              />

              <FormInput
                label="Phone Number"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                icon={Phone}
                required
              />

              <FormInput
                label="Home Address / Emergency Location"
                name="address"
                value={formData.address}
                onChange={handleChange}
                icon={MapPin}
              />

              <FormInput
                label="Avatar URL"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
              />

              <div style={{ marginTop: '1.5rem' }}>
                <Button type="submit" variant="primary" icon={Save}>
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </div>

          {/* Account Data & Maintenance Card */}
          <div>
            <div className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '1rem' }}>
                Data & Storage State
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                All user accounts, pets, bookings, and health records are saved locally inside your browser's <code>localStorage</code>.
              </p>

              <Button
                variant="outline"
                fullWidth
                icon={RefreshCw}
                onClick={resetAllData}
              >
                Reset Demo Storage Data
              </Button>
            </div>

            <div className="card" style={{ background: 'var(--primary-light)', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--primary)', fontWeight: '700', marginBottom: '0.5rem' }}>
                <CheckCircle2 size={20} /> Verified Pet Care Account
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: 0 }}>
                Your account is active. Emergency contact dispatch is ready to send medical logs if requested.
              </p>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
};
