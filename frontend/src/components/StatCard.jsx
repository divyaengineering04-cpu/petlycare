import React from 'react';

export const StatCard = ({ title, count, icon: Icon, color = 'primary', subtext, onClick }) => {
  const bgStyles = {
    primary: { bg: 'var(--primary-light)', text: 'var(--primary)' },
    amber: { bg: 'var(--accent-amber-light)', text: 'var(--accent-amber)' },
    emerald: { bg: 'var(--accent-emerald-light)', text: 'var(--accent-emerald)' },
    rose: { bg: 'var(--accent-rose-light)', text: 'var(--accent-rose)' }
  };

  const style = bgStyles[color] || bgStyles.primary;

  return (
    <div
      onClick={onClick}
      className={`card ${onClick ? 'card-interactive' : ''}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: onClick ? 'pointer' : 'default'
      }}
    >
      <div>
        <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
          {title}
        </span>
        <h3 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
          {count}
        </h3>
        {subtext && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'block' }}>{subtext}</span>}
      </div>

      <div style={{
        width: '52px',
        height: '52px',
        borderRadius: 'var(--radius-md)',
        background: style.bg,
        color: style.text,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Icon size={26} />
      </div>
    </div>
  );
};
