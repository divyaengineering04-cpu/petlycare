import React from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, Heart, Phone, Mail, MapPin, ShieldAlert } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{ background: '#0F172A', color: '#94A3B8', paddingTop: '4rem', paddingBottom: '2rem', marginTop: 'auto' }}>
      <div className="container">
        <div className="grid grid-cols-4" style={{ marginBottom: '3rem' }}>
          
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div style={{ background: 'var(--primary)', color: '#FFF', padding: '0.4rem', borderRadius: '10px' }}>
                <PawPrint size={22} />
              </div>
              <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#FFFFFF' }}>
                Petly<span style={{ color: 'var(--accent-amber)' }}>.</span>
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              Your complete pet care companion. Booking verified groomers, vet consultations, walkers & 24/7 emergency response with ease.
            </p>
            <div style={{ display: 'flex', gap: '1rem', color: '#FFFFFF' }}>
              <span>🐾 Loving pet care everyday</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontWeight: '700', fontSize: '1.05rem', marginBottom: '1.25rem' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li><Link to="/" style={{ color: '#94A3B8', transition: 'var(--transition-fast)' }}>Home</Link></li>
              <li><Link to="/services" style={{ color: '#94A3B8' }}>Pet Care Services</Link></li>
              <li><Link to="/book" style={{ color: '#94A3B8' }}>Book a Service</Link></li>
              <li><Link to="/emergency" style={{ color: 'var(--accent-rose)' }}>24/7 Emergency SOS</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontWeight: '700', fontSize: '1.05rem', marginBottom: '1.25rem' }}>Our Services</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li>Pet Grooming & Spa</li>
              <li>Vet Consultation</li>
              <li>Dog Walking</li>
              <li>In-Home Pet Sitting</li>
              <li>Pet Taxi & Transport</li>
            </ul>
          </div>

          {/* Emergency Helpline Banner */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontWeight: '700', fontSize: '1.05rem', marginBottom: '1.25rem' }}>Emergency Care</h4>
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              color: '#FFFFFF'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-rose)', fontWeight: '700', marginBottom: '0.5rem' }}>
                <ShieldAlert size={20} /> 24/7 Urgent Hotline
              </div>
              <p style={{ fontSize: '1.1rem', fontWeight: '800', color: '#FFFFFF', margin: 0 }}>+1 (800) 555-PETS</p>
              <p style={{ fontSize: '0.8rem', color: '#CBD5E1', marginTop: '0.25rem' }}>Immediate vet guidance and ambulance dispatch</p>
            </div>
          </div>

        </div>

        <div style={{
          borderTop: '1px solid #1E293B',
          paddingTop: '1.5rem',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.85rem'
        }}>
          <p>© 2026 Petly Pet Care Inc. All rights reserved. Crafted with care for pets.</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            Made with <Heart size={16} style={{ color: 'var(--accent-rose)', fill: 'var(--accent-rose)' }} /> for pet lovers
          </p>
        </div>
      </div>
    </footer>
  );
};
