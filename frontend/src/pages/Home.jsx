import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePetly } from '../context/PetlyContext';
import { ServiceCard } from '../components/ServiceCard';
import { Button } from '../components/Button';
import { PawPrint, Calendar, Heart, ShieldAlert, Sparkles, CheckCircle2, Star, ArrowRight, UserCheck, Clock, PhoneCall } from 'lucide-react';

export const Home = () => {
  const { services } = usePetly();
  const navigate = useNavigate();

  const popularServices = services.slice(0, 3);

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh' }}>
      
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '5rem 0 6rem',
        background: 'radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.12) 0%, rgba(245, 158, 11, 0.08) 50%, rgba(248, 250, 252, 0) 100%)',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '3rem', alignItems: 'center' }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 1rem',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: '700',
              marginBottom: '1.5rem'
            }}>
              <Sparkles size={16} /> #1 Rated Pet Care Platform
            </div>

            <h1 style={{
              fontSize: '3.5rem',
              fontWeight: '800',
              lineHeight: '1.15',
              color: 'var(--text-main)',
              letterSpacing: '-1px',
              marginBottom: '1.25rem'
            }}>
              Loving Care for Your <span style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-amber) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>Furry Family</span>
            </h1>

            <p style={{
              fontSize: '1.15rem',
              color: 'var(--text-muted)',
              lineHeight: '1.6',
              marginBottom: '2rem',
              maxWidth: '540px'
            }}>
              Book professional grooming, vet consultations, dog walking, and pet sitting with trusted caregivers. Track health records & enjoy 24/7 emergency support.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              <Button size="lg" icon={Calendar} onClick={() => navigate('/book')}>
                Book a Service
              </Button>
              <Button size="lg" variant="outline" icon={PawPrint} onClick={() => navigate('/services')}>
                Explore Services
              </Button>
            </div>

            {/* Quick Stats */}
            <div style={{ display: 'flex', gap: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
              <div>
                <strong style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', display: 'block' }}>15,000+</strong>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Happy Pets Served</span>
              </div>
              <div>
                <strong style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', display: 'block' }}>4.9 ★</strong>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Average Rating</span>
              </div>
              <div>
                <strong style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', display: 'block' }}>24/7</strong>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Emergency SOS Care</span>
              </div>
            </div>
          </div>

          {/* Hero Image / Card Showcase */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'relative',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
              border: '4px solid #FFFFFF'
            }}>
              <img
                src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=800"
                alt="Happy dogs running"
                style={{ width: '100%', height: '440px', objectFit: 'cover', display: 'block' }}
              />
            </div>

            {/* Floating Glass Badges */}
            <div className="glass-panel" style={{
              position: 'absolute',
              bottom: '-20px',
              left: '-20px',
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <div style={{ background: 'var(--accent-emerald)', color: '#FFF', padding: '0.5rem', borderRadius: '50%' }}>
                <CheckCircle2 size={24} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-main)' }}>100% Certified Professionals</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Background checked & vet approved</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Short Introduction About Petly */}
      <section style={{ padding: '4rem 0', background: '#FFFFFF', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '1rem' }}>
            Why Pet Parents Choose <span style={{ color: 'var(--primary)' }}>Petly</span>
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>
            Petly is an all-in-one digital pet care management suite designed to take the stress out of pet parenting. From scheduling grooming to tracking vaccination reminders and urgent emergency alerts, Petly keeps your pet healthy, happy, and cared for.
          </p>
        </div>
      </section>

      {/* Popular Pet Services */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
            <div>
              <span className="badge badge-info" style={{ marginBottom: '0.5rem' }}>OUR SERVICES</span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--text-main)' }}>
                Popular Pet Care Services
              </h2>
            </div>
            <Link to="/services">
              <Button variant="outline" icon={ArrowRight}>View All Services</Button>
            </Link>
          </div>

          <div className="grid grid-cols-3">
            {popularServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* How Petly Works */}
      <section style={{ padding: '5rem 0', background: '#FFFFFF', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="badge badge-warning" style={{ marginBottom: '0.5rem' }}>SIMPLE PROCESS</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--text-main)' }}>
              How Petly Works
            </h2>
          </div>

          <div className="grid grid-cols-3">
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                fontWeight: '800',
                fontSize: '1.4rem'
              }}>
                1
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Add Your Pet Profile</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Enter pet details, age, breed, weight, and vaccination history for customized care.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--accent-amber-light)',
                color: 'var(--accent-amber)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                fontWeight: '800',
                fontSize: '1.4rem'
              }}>
                2
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Choose Service & Time</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Pick from grooming, vet care, walking, sitting or taxi and choose your preferred slot.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--accent-emerald-light)',
                color: 'var(--accent-emerald)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                fontWeight: '800',
                fontSize: '1.4rem'
              }}>
                3
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Relax & Track Progress</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Receive real-time updates, vaccination alerts, and easy booking status tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
            <div>
              <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>BENEFITS</span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '1.5rem' }}>
                Everything Your Pet Needs in One Place
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.5rem', borderRadius: '10px' }}>
                    <UserCheck size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: '700' }}>Verified Pet Specialists</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>All groomers, vets, and sitters are thoroughly vetted with identity verification.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ background: 'var(--accent-rose-light)', color: 'var(--accent-rose)', padding: '0.5rem', borderRadius: '10px' }}>
                    <ShieldAlert size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: '700' }}>Instant 24/7 SOS Alert</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Immediate access to nearby emergency vet clinics and pet ambulance services.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ background: 'var(--accent-amber-light)', color: 'var(--accent-amber)', padding: '0.5rem', borderRadius: '10px' }}>
                    <Clock size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: '700' }}>Smart Health & Medication Reminders</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Never miss a booster vaccination, flea treatment, or medication dose again.</p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <img
                src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=600"
                alt="Pet care consultation"
                style={{ width: '100%', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Call Banner CTA */}
      <section style={{
        background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
        color: '#FFFFFF',
        padding: '4rem 0',
        margin: '2rem 0'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <span className="badge badge-danger" style={{ marginBottom: '0.75rem' }}>IMMEDIATE PET CARE</span>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '0.5rem' }}>
              Need Emergency Assistance for Your Pet?
            </h2>
            <p style={{ color: '#CBD5E1', fontSize: '1rem' }}>
              Our 24/7 Emergency SOS network is ready to assist with urgent medical guidance and vet dispatch.
            </p>
          </div>
          <Button variant="danger" size="lg" icon={PhoneCall} onClick={() => navigate('/emergency')}>
            Open Emergency Helpline
          </Button>
        </div>
      </section>

    </div>
  );
};
