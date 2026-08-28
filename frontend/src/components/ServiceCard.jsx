import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Scissors, Stethoscope, Footprints, Home, Car, Star, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const iconMap = {
  Scissors,
  Stethoscope,
  Footprints,
  Home,
  Car
};

export const ServiceCard = ({ service }) => {
  const navigate = useNavigate();
  const IconComponent = iconMap[service.iconName] || Scissors;

  const handleBookClick = () => {
    navigate('/book', { state: { serviceId: service.id } });
  };

  return (
    <div className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', padding: 0 }}>
      <div style={{ position: 'relative', height: '180px', width: '100%', overflow: 'hidden' }}>
        <img
          src={service.image}
          alt={service.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {service.popular && (
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'var(--accent-amber)',
            color: '#FFF',
            padding: '0.25rem 0.65rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            fontWeight: '700',
            boxShadow: 'var(--shadow-md)'
          }}>
            ★ POPULAR
          </div>
        )}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(6px)',
          color: '#FFF',
          padding: '0.4rem 0.65rem',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.85rem'
        }}>
          <IconComponent size={16} style={{ color: 'var(--accent-amber)' }} />
          <span>{service.duration}</span>
        </div>
      </div>

      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-main)' }}>{service.name}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--accent-amber)', fontSize: '0.85rem', fontWeight: '700' }}>
              <Star size={14} fill="var(--accent-amber)" />
              <span>{service.rating}</span>
            </div>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1rem' }}>
            {service.shortDescription}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Starting from</span>
            <span style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--primary)' }}>
              {formatCurrency(service.price)}
            </span>
          </div>

          <button
            onClick={handleBookClick}
            className="btn btn-primary btn-sm"
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            <span>Book Now</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
