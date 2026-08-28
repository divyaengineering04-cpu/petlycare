import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PawPrint, Calendar, PlusCircle, Heart, ShieldAlert, Settings, LogOut, ShoppingBag } from 'lucide-react';
import { usePetly } from '../context/PetlyContext';

export const Sidebar = () => {
  const location = useLocation();
  const { logout, user } = usePetly();

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Pets', path: '/pets', icon: PawPrint },
    { label: 'Buy & Adopt Pets', path: '/marketplace', icon: ShoppingBag },
    { label: 'Book Service', path: '/book', icon: PlusCircle },
    { label: 'My Bookings', path: '/bookings', icon: Calendar },
    { label: 'Pet Health', path: '/health', icon: Heart },
    { label: 'Emergency Help', path: '/emergency', icon: ShieldAlert, highlight: true },
    { label: 'Settings', path: '/settings', icon: Settings }
  ];

  return (
    <aside style={{
      width: '260px',
      background: '#FFFFFF',
      borderRight: '1px solid var(--border-color)',
      padding: '1.5rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      justify: 'space-between',
      minHeight: 'calc(100vh - 72px)'
    }}>
      <div>
        <div style={{
          padding: '1rem',
          background: 'var(--primary-light)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
            alt="User Avatar"
            style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontWeight: '700', fontSize: '0.95rem', margin: 0, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user?.name || 'Pet Owner'}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '600', margin: 0 }}>Verified Member</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: active ? '700' : '600',
                  fontSize: '0.9rem',
                  color: active
                    ? (item.highlight ? 'var(--accent-rose)' : 'var(--primary)')
                    : (item.highlight ? 'var(--accent-rose)' : 'var(--text-muted)'),
                  background: active
                    ? (item.highlight ? 'var(--accent-rose-light)' : 'var(--primary-light)')
                    : 'transparent',
                  transition: 'var(--transition-fast)'
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
        <button
          onClick={logout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            fontWeight: '600',
            fontSize: '0.9rem',
            color: 'var(--accent-rose)',
            width: '100%'
          }}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
