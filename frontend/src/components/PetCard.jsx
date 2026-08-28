import React from 'react';
import { Edit3, Trash2, ShieldCheck, Heart, Calendar, Scale } from 'lucide-react';
import { getStatusBadgeClass } from '../utils/formatters';

export const PetCard = ({ pet, onEdit, onDelete }) => {
  return (
    <div className="card card-interactive" style={{ position: 'relative', overflow: 'hidden', padding: 0 }}>
      {/* Header Banner */}
      <div style={{ position: 'relative', height: '160px', width: '100%' }}>
        <img
          src={pet.image || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400'}
          alt={pet.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          display: 'flex',
          gap: '0.4rem'
        }}>
          <button
            onClick={() => onEdit(pet)}
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(4px)',
              padding: '0.45rem',
              borderRadius: '50%',
              color: 'var(--text-main)',
              boxShadow: 'var(--shadow-sm)'
            }}
            title="Edit Pet Profile"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={() => onDelete(pet.id)}
            style={{
              background: 'rgba(239, 68, 68, 0.9)',
              backdropFilter: 'blur(4px)',
              padding: '0.45rem',
              borderRadius: '50%',
              color: '#FFFFFF',
              boxShadow: 'var(--shadow-sm)'
            }}
            title="Delete Pet"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div style={{ position: 'absolute', bottom: '12px', left: '12px' }}>
          <span className={`badge ${getStatusBadgeClass(pet.vaccinationStatus)}`}>
            <ShieldCheck size={12} /> {pet.vaccinationStatus}
          </span>
        </div>
      </div>

      {/* Pet Info */}
      <div style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>{pet.name}</h3>
          <span style={{
            fontSize: '0.8rem',
            padding: '0.2rem 0.6rem',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            borderRadius: 'var(--radius-sm)',
            fontWeight: '700'
          }}>
            {pet.type || 'Dog'}
          </span>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600', marginBottom: '1rem' }}>
          {pet.breed}
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.5rem',
          background: 'var(--bg-main)',
          padding: '0.75rem',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center',
          fontSize: '0.8rem'
        }}>
          <div>
            <span style={{ display: 'block', color: 'var(--text-muted)' }}>Age</span>
            <strong style={{ color: 'var(--text-main)' }}>{pet.age} yrs</strong>
          </div>
          <div>
            <span style={{ display: 'block', color: 'var(--text-muted)' }}>Gender</span>
            <strong style={{ color: 'var(--text-main)' }}>{pet.gender}</strong>
          </div>
          <div>
            <span style={{ display: 'block', color: 'var(--text-muted)' }}>Weight</span>
            <strong style={{ color: 'var(--text-main)' }}>{pet.weight} kg</strong>
          </div>
        </div>

        {pet.notes && (
          <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            "{pet.notes}"
          </p>
        )}
      </div>
    </div>
  );
};
