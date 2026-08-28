import React from 'react';
import { Calendar, Clock, Trash2, CheckCircle2, Circle, Syringe, Pill } from 'lucide-react';
import { formatDate } from '../utils/formatters';

export const ReminderCard = ({ reminder, onToggle, onDelete }) => {
  const isVaccine = reminder.type === 'Vaccination';
  const isCompleted = reminder.status === 'Completed';

  return (
    <div className="card" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      opacity: isCompleted ? 0.65 : 1,
      background: isCompleted ? 'var(--bg-main)' : '#FFFFFF',
      transition: 'var(--transition-fast)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={() => onToggle(reminder.id)}
          style={{ color: isCompleted ? 'var(--accent-emerald)' : 'var(--text-muted)' }}
          title={isCompleted ? 'Mark as Active' : 'Mark as Completed'}
        >
          {isCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} />}
        </button>

        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          background: isVaccine ? 'var(--primary-light)' : 'var(--accent-amber-light)',
          color: isVaccine ? 'var(--primary)' : 'var(--accent-amber)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {isVaccine ? <Syringe size={20} /> : <Pill size={20} />}
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: '700',
              color: 'var(--text-main)',
              textDecoration: isCompleted ? 'line-through' : 'none'
            }}>
              {reminder.title}
            </h4>
            <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>
              {reminder.petName}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Calendar size={13} /> {formatDate(reminder.dueDate)}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Clock size={13} /> {reminder.time}
            </span>
          </div>
          {reminder.notes && (
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Note: {reminder.notes}
            </p>
          )}
        </div>
      </div>

      <button
        onClick={() => onDelete(reminder.id)}
        style={{ color: 'var(--text-light)', padding: '0.4rem' }}
        title="Delete Reminder"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};
