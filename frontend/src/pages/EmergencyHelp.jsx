import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { ShieldAlert, PhoneCall, Truck, Hospital, AlertTriangle, CheckCircle2, Info, HeartPulse } from 'lucide-react';

export const EmergencyHelp = () => {
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [sosStatus, setSosStatus] = useState('idle'); // idle -> searching -> dispatched

  useEffect(() => {
    api.get('/emergency')
      .then(setEmergencyContacts)
      .catch(() => setEmergencyContacts([]));
  }, []);

  const handleSosClick = () => {
    setIsSosModalOpen(true);
    setSosStatus('searching');

    setTimeout(() => {
      setSosStatus('dispatched');
    }, 2500);
  };

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', padding: '3rem 0 5rem' }}>
      <div className="container">
        
        {/* Banner with Urgent SOS Trigger */}
        <div className="card pulse-animation" style={{
          background: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
          color: '#FFFFFF',
          padding: '2.5rem',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '3rem',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '2rem',
          boxShadow: '0 12px 30px rgba(220, 38, 38, 0.4)'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '0.75rem'
            }}>
              <ShieldAlert size={16} /> 24/7 PET SOS EMERGENCY RESPONSE
            </div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: '800', margin: '0 0 0.5rem', color: '#FFFFFF' }}>
              Pet Care Emergency Help Center
            </h1>
            <p style={{ color: '#FEE2E2', fontSize: '1.05rem', margin: 0, maxWidth: '600px' }}>
              Press the SOS button below for immediate emergency ambulance dispatch and 24/7 veterinary triage assistance.
            </p>
          </div>

          <button
            onClick={handleSosClick}
            style={{
              padding: '1.25rem 2.5rem',
              background: '#FFFFFF',
              color: '#DC2626',
              borderRadius: 'var(--radius-full)',
              fontWeight: '900',
              fontSize: '1.25rem',
              boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
              transition: 'var(--transition-fast)'
            }}
          >
            <ShieldAlert size={28} />
            <span>TRIGGER SOS EMERGENCY</span>
          </button>
        </div>

        {/* Directory Grid: Hospitals & Ambulance */}
        <div style={{ marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Hospital style={{ color: 'var(--accent-rose)' }} /> Emergency Vet Clinics & Ambulance Network
          </h2>

          <div className="grid grid-cols-3">
            {emergencyContacts.map((item) => (
              <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <span className={`badge ${item.type === 'Hospital' ? 'badge-danger' : item.type === 'Ambulance' ? 'badge-warning' : 'badge-info'}`}>
                      {item.type}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>{item.distance}</span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                    {item.name}
                  </h3>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    📍 {item.address}
                  </p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--accent-emerald)', fontWeight: '700' }}>
                    ⏰ {item.openHours}
                  </p>
                </div>

                <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                  <a
                    href={`tel:${item.phone}`}
                    className="btn btn-danger fullWidth"
                    style={{ width: '100%', textDecoration: 'none' }}
                  >
                    <PhoneCall size={18} /> Call {item.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Basic Emergency Care Guide / First Aid */}
        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HeartPulse style={{ color: 'var(--accent-amber)' }} /> Pet First-Aid Emergency Guidelines
          </h2>

          <div className="grid grid-cols-2">
            <div style={{ background: 'var(--bg-main)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ color: 'var(--accent-rose)', fontWeight: '700', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <AlertTriangle size={18} /> Toxic Ingestion or Poisoning
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Do not induce vomiting unless specifically advised by a vet. Keep the packaging/sample of the consumed substance and call ASPCA Poison Control (+1 888-426-4435) immediately.
              </p>
            </div>

            <div style={{ background: 'var(--bg-main)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ color: 'var(--accent-amber)', fontWeight: '700', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <AlertTriangle size={18} /> Severe Bleeding or Wound
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Apply firm, direct pressure to the wound with a clean cloth or towel. Keep your pet warm with a blanket and minimize sudden movements during transport to clinic.
              </p>
            </div>
          </div>
        </div>

        {/* SOS Confirmation & Alert Modal */}
        <Modal
          isOpen={isSosModalOpen}
          onClose={() => setIsSosModalOpen(false)}
          title="🚨 EMERGENCY SOS DISPATCH ALERT"
        >
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            {sosStatus === 'searching' ? (
              <div>
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: 'var(--accent-rose-light)',
                  color: 'var(--accent-rose)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem'
                }} className="pulse-animation">
                  <ShieldAlert size={40} />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                  Locating Nearest Pet Ambulance...
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Connecting your GPS location to 24/7 emergency dispatch units.
                </p>
              </div>
            ) : (
              <div>
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: 'var(--accent-emerald-light)',
                  color: 'var(--accent-emerald)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem'
                }}>
                  <CheckCircle2 size={42} />
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                  SOS Dispatch Confirmed!
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                  An emergency pet responder and triage specialist have been notified. Stay calm.
                </p>

                <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'left', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                  <p><strong>Hotline:</strong> +1 (800) 555-PETS</p>
                  <p><strong>Status:</strong> Mobile Unit En Route (ETA: 8 mins)</p>
                  <p><strong>Action Required:</strong> Keep pet still and calm.</p>
                </div>

                <Button variant="danger" fullWidth onClick={() => setIsSosModalOpen(false)}>
                  Close Alert & Call Helpline Now
                </Button>
              </div>
            )}
          </div>
        </Modal>

      </div>
    </div>
  );
};
