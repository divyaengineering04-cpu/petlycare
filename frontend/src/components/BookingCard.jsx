import React from 'react';
import { Calendar, Clock, PawPrint, CreditCard, Eye, XCircle, FileText, CheckCircle2 } from 'lucide-react';
import { getStatusBadgeClass, formatDate, formatCurrency } from '../utils/formatters';

export const BookingCard = ({ booking, onCancel, onViewDetails, onPayNow }) => {
  const isPaid = booking.paymentStatus === 'Paid';
  const isCancelled = booking.status === 'Cancelled';

  return (
    <div className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
            <span className={`badge ${getStatusBadgeClass(booking.status)}`}>
              {booking.status}
            </span>
            <span className={`badge ${getStatusBadgeClass(booking.paymentStatus)}`}>
              {isPaid ? '✓ Paid' : booking.paymentStatus || 'Unpaid'}
            </span>
          </div>

          <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)', margin: '0.2rem 0' }}>
            {booking.serviceName}
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <PawPrint size={14} style={{ color: 'var(--primary)' }} /> Pet: <strong>{booking.petName}</strong>
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary)', display: 'block' }}>
            {formatCurrency(booking.price)}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {booking.id}</span>
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem',
        padding: '0.65rem 0.85rem',
        background: 'var(--bg-main)',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.85rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-main)' }}>
          <Calendar size={16} style={{ color: 'var(--primary)' }} />
          <span>{formatDate(booking.date)}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-main)' }}>
          <Clock size={16} style={{ color: 'var(--accent-amber)' }} />
          <span>{booking.time}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
        
        {!isPaid && !isCancelled && onPayNow && (
          <button
            onClick={() => onPayNow(booking)}
            className="btn btn-secondary btn-sm"
          >
            <CreditCard size={14} /> Pay Now
          </button>
        )}

        <button
          onClick={() => onViewDetails(booking)}
          className="btn btn-outline btn-sm"
        >
          <Eye size={14} /> Details
        </button>

        {!isCancelled && (
          <button
            onClick={() => onCancel(booking.id)}
            className="btn btn-danger btn-sm"
          >
            <XCircle size={14} /> Cancel
          </button>
        )}
      </div>
    </div>
  );
};
