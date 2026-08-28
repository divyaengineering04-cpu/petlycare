import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usePetly } from '../context/PetlyContext';
import { Sidebar } from '../components/Sidebar';
import { StatCard } from '../components/StatCard';
import { BookingCard } from '../components/BookingCard';
import { PetCard } from '../components/PetCard';
import { Button } from '../components/Button';
import { PawPrint, Calendar, Heart, Scissors, PlusCircle, ShieldAlert, ArrowRight, UserCheck } from 'lucide-react';

export const Dashboard = () => {
  const { user, pets, bookings, reminders, services, cancelBooking, deletePet } = usePetly();
  const navigate = useNavigate();

  const activeBookings = bookings.filter(b => b.status !== 'Cancelled');
  const activeReminders = reminders.filter(r => r.status === 'Active');
  const recentBookings = bookings.slice(0, 3);
  const samplePets = pets.slice(0, 2);

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        {/* Welcome Banner */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
          color: '#FFFFFF',
          marginBottom: '2rem',
          padding: '2rem',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          <div>
            <span style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(4px)',
              padding: '0.25rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              OVERVIEW DASHBOARD
            </span>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: '0.5rem 0 0.25rem' }}>
              Welcome back, {user?.name?.split(' ')[0] || 'Pet Owner'}! 👋
            </h1>
            <p style={{ color: '#EEF2FF', fontSize: '0.95rem', margin: 0 }}>
              You have {activeBookings.length} upcoming appointments and {activeReminders.length} active health reminders today.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Button variant="secondary" icon={PlusCircle} onClick={() => navigate('/book')}>
              Book Service
            </Button>
            <Button variant="danger" icon={ShieldAlert} onClick={() => navigate('/emergency')}>
              Emergency SOS
            </Button>
          </div>
        </div>

        {/* Stat Cards Grid */}
        <div className="grid grid-cols-4" style={{ marginBottom: '2rem' }}>
          <StatCard
            title="Total Pets"
            count={pets.length}
            icon={PawPrint}
            color="primary"
            subtext="Registered in Petly"
            onClick={() => navigate('/pets')}
          />
          <StatCard
            title="Upcoming Bookings"
            count={activeBookings.length}
            icon={Calendar}
            color="amber"
            subtext="Confirmed & pending"
            onClick={() => navigate('/bookings')}
          />
          <StatCard
            title="Active Reminders"
            count={activeReminders.length}
            icon={Heart}
            color="rose"
            subtext="Vaccines & meds"
            onClick={() => navigate('/health')}
          />
          <StatCard
            title="Available Services"
            count={services.length}
            icon={Scissors}
            color="emerald"
            subtext="Grooming, Vet & more"
            onClick={() => navigate('/services')}
          />
        </div>

        {/* Quick Action Buttons */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '1rem' }}>
            Quick Actions
          </h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/pets')}
              style={{
                flex: 1,
                minWidth: '180px',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                background: '#FFFFFF',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontWeight: '700',
                fontSize: '0.9rem',
                color: 'var(--text-main)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.5rem', borderRadius: '10px' }}>
                <PawPrint size={20} />
              </div>
              <span>Add / Manage Pets</span>
            </button>

            <button
              onClick={() => navigate('/book')}
              style={{
                flex: 1,
                minWidth: '180px',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                background: '#FFFFFF',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontWeight: '700',
                fontSize: '0.9rem',
                color: 'var(--text-main)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ background: 'var(--accent-amber-light)', color: 'var(--accent-amber)', padding: '0.5rem', borderRadius: '10px' }}>
                <Calendar size={20} />
              </div>
              <span>Schedule Booking</span>
            </button>

            <button
              onClick={() => navigate('/health')}
              style={{
                flex: 1,
                minWidth: '180px',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                background: '#FFFFFF',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontWeight: '700',
                fontSize: '0.9rem',
                color: 'var(--text-main)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ background: 'var(--accent-emerald-light)', color: 'var(--accent-emerald)', padding: '0.5rem', borderRadius: '10px' }}>
                <Heart size={20} />
              </div>
              <span>Pet Health Log</span>
            </button>

            <button
              onClick={() => navigate('/emergency')}
              style={{
                flex: 1,
                minWidth: '180px',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                background: '#FFFFFF',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontWeight: '700',
                fontSize: '0.9rem',
                color: 'var(--text-main)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ background: 'var(--accent-rose-light)', color: 'var(--accent-rose)', padding: '0.5rem', borderRadius: '10px' }}>
                <ShieldAlert size={20} />
              </div>
              <span>24/7 SOS Helpline</span>
            </button>
          </div>
        </div>

        {/* Dashboard Grid: Recent Bookings & Pets */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }}>
          
          {/* Recent Bookings Section */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-main)' }}>
                Recent Service Bookings
              </h3>
              <Link to="/bookings" style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                View All ({bookings.length}) <ArrowRight size={14} />
              </Link>
            </div>

            {recentBookings.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}>
                <Calendar size={40} style={{ margin: '0 auto 1rem', color: 'var(--text-light)' }} />
                <p>No bookings yet.</p>
                <Button variant="primary" size="sm" onClick={() => navigate('/book')}>Book First Service</Button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {recentBookings.map((b) => (
                  <BookingCard
                    key={b.id}
                    booking={b}
                    onCancel={cancelBooking}
                    onViewDetails={() => navigate('/bookings')}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Registered Pets Sidebar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-main)' }}>
                Your Pets
              </h3>
              <Link to="/pets" style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                Manage Pets <ArrowRight size={14} />
              </Link>
            </div>

            {pets.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}>
                <PawPrint size={40} style={{ margin: '0 auto 1rem', color: 'var(--text-light)' }} />
                <p>No pets registered yet.</p>
                <Button variant="primary" size="sm" onClick={() => navigate('/pets')}>Add Pet</Button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {samplePets.map((pet) => (
                  <PetCard
                    key={pet.id}
                    pet={pet}
                    onEdit={() => navigate('/pets')}
                    onDelete={deletePet}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};
