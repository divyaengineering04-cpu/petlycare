import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { usePetly } from '../context/PetlyContext';
import { PawPrint, User, LogOut, Menu, X, Calendar, Heart, ShieldAlert, LayoutDashboard, Settings, ShoppingBag } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = usePetly();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 900,
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0.85rem 0'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <div style={{
            background: 'linear-gradient(135deg, #4F46E5 0%, #F59E0B 100%)',
            color: '#FFFFFF',
            padding: '0.5rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(79, 70, 229, 0.25)'
          }}>
            <PawPrint size={24} />
          </div>
          <span style={{ fontSize: '1.45rem', fontWeight: '800', letterSpacing: '-0.5px', color: 'var(--text-main)' }}>
            Petly<span style={{ color: 'var(--accent-amber)' }}>.</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }} className="desktop-nav">
          <Link
            to="/"
            style={{
              fontWeight: '600',
              fontSize: '0.95rem',
              color: isActive('/') ? 'var(--primary)' : 'var(--text-muted)',
              transition: 'var(--transition-fast)'
            }}
          >
            Home
          </Link>
          <Link
            to="/services"
            style={{
              fontWeight: '600',
              fontSize: '0.95rem',
              color: isActive('/services') ? 'var(--primary)' : 'var(--text-muted)',
              transition: 'var(--transition-fast)'
            }}
          >
            Services
          </Link>
          <Link
            to="/marketplace"
            style={{
              fontWeight: '700',
              fontSize: '0.95rem',
              color: isActive('/marketplace') ? 'var(--primary)' : 'var(--accent-amber)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'var(--transition-fast)'
            }}
          >
            <ShoppingBag size={16} /> Buy & Adopt Pets
          </Link>
          <Link
            to="/emergency"
            style={{
              fontWeight: '600',
              fontSize: '0.95rem',
              color: isActive('/emergency') ? 'var(--accent-rose)' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'var(--transition-fast)'
            }}
          >
            <ShieldAlert size={16} /> Emergency SOS
          </Link>

          {isAuthenticated && (
            <>
              <Link
                to="/dashboard"
                style={{
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  color: isActive('/dashboard') ? 'var(--primary)' : 'var(--text-muted)'
                }}
              >
                Dashboard
              </Link>
              <Link
                to="/bookings"
                style={{
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  color: isActive('/bookings') ? 'var(--primary)' : 'var(--text-muted)'
                }}
              >
                My Bookings
              </Link>
            </>
          )}
        </nav>

        {/* Right side CTA & User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-main)'
                }}
              >
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                  alt={user?.name}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                  {user?.name?.split(' ')[0] || 'User'}
                </span>
              </button>

              {userDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '110%',
                  width: '220px',
                  background: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--border-color)',
                  padding: '0.5rem 0',
                  zIndex: 950
                }}>
                  <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)' }}>
                    <p style={{ fontWeight: '700', fontSize: '0.9rem', margin: 0 }}>{user?.name}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{user?.email}</p>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setUserDropdownOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.65rem 1rem', fontSize: '0.9rem', color: 'var(--text-main)' }}
                  >
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                  <Link
                    to="/marketplace"
                    onClick={() => setUserDropdownOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.65rem 1rem', fontSize: '0.9rem', color: 'var(--text-main)' }}
                  >
                    <ShoppingBag size={16} /> Buy & Adopt Pets
                  </Link>
                  <Link
                    to="/pets"
                    onClick={() => setUserDropdownOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.65rem 1rem', fontSize: '0.9rem', color: 'var(--text-main)' }}
                  >
                    <PawPrint size={16} /> My Pets
                  </Link>
                  <Link
                    to="/health"
                    onClick={() => setUserDropdownOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.65rem 1rem', fontSize: '0.9rem', color: 'var(--text-main)' }}
                  >
                    <Heart size={16} /> Pet Health
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setUserDropdownOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.65rem 1rem', fontSize: '0.9rem', color: 'var(--text-main)' }}
                  >
                    <Settings size={16} /> Profile Settings
                  </Link>
                  <div style={{ borderTop: '1px solid var(--border-color)', margin: '0.25rem 0' }}></div>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                      navigate('/');
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.65rem 1rem', fontSize: '0.9rem', color: 'var(--accent-rose)', width: '100%' }}
                  >
                    <LogOut size={16} /> Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/login">
                <button className="btn btn-outline btn-sm">Log In</button>
              </Link>
              <Link to="/register">
                <button className="btn btn-primary btn-sm">Register</button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'none', padding: '0.4rem', color: 'var(--text-main)' }}
            className="mobile-toggle-btn"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div style={{
          background: '#FFFFFF',
          borderBottom: '1px solid var(--border-color)',
          padding: '1rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link to="/services" onClick={() => setMobileMenuOpen(false)}>Services</Link>
          <Link to="/marketplace" onClick={() => setMobileMenuOpen(false)}>Buy & Adopt Pets</Link>
          <Link to="/emergency" onClick={() => setMobileMenuOpen(false)}>Emergency SOS</Link>
          {isAuthenticated && (
            <>
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
              <Link to="/pets" onClick={() => setMobileMenuOpen(false)}>My Pets</Link>
              <Link to="/bookings" onClick={() => setMobileMenuOpen(false)}>My Bookings</Link>
              <Link to="/health" onClick={() => setMobileMenuOpen(false)}>Pet Health</Link>
              <Link to="/settings" onClick={() => setMobileMenuOpen(false)}>Profile Settings</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};
