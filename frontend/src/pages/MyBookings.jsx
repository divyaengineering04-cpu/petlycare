import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePetly } from '../context/PetlyContext';
import { Sidebar } from '../components/Sidebar';
import { BookingCard } from '../components/BookingCard';
import { Modal } from '../components/Modal';
import { PaymentModal } from '../components/PaymentModal';
import { Button } from '../components/Button';
import { Calendar, PlusCircle, CreditCard, PawPrint, CheckCircle2, XCircle, FileText, Download } from 'lucide-react';
import { formatDate, formatCurrency, getStatusBadgeClass } from '../utils/formatters';

export const MyBookings = () => {
  const { bookings, cancelBooking, payForBooking } = usePetly();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('All');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'All') return true;
    return b.status.toLowerCase() === activeTab.toLowerCase();
  });

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(true);
  };

  const handlePayNow = (booking) => {
    setSelectedBooking(booking);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (paymentInfo) => {
    if (selectedBooking) {
      payForBooking(selectedBooking.id, {
        amount: paymentInfo.amount,
        method: paymentInfo.method
      });
      setSelectedBooking(prev => ({
        ...prev,
        paymentStatus: 'Paid',
        paymentMethod: paymentInfo.method
      }));
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)' }}>My Appointments & Payments</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Track scheduled services, manage payments, download receipts, or cancel bookings.
            </p>
          </div>

          <Button icon={PlusCircle} onClick={() => navigate('/book')}>
            Book New Service
          </Button>
        </div>

        {/* Tab Filters */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          {['All', 'Pending', 'Confirmed', 'Cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: '700',
                fontSize: '0.9rem',
                background: activeTab === tab ? 'var(--primary)' : 'transparent',
                color: activeTab === tab ? '#FFFFFF' : 'var(--text-muted)',
                transition: 'var(--transition-fast)'
              }}
            >
              {tab} ({tab === 'All' ? bookings.length : bookings.filter(b => b.status.toLowerCase() === tab.toLowerCase()).length})
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <Calendar size={48} style={{ color: 'var(--text-light)', margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>No {activeTab !== 'All' ? activeTab : ''} Bookings Found</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Schedule a service now for your pet.</p>
            <Button icon={PlusCircle} onClick={() => navigate('/book')}>Book Service</Button>
          </div>
        ) : (
          <div className="grid grid-cols-2">
            {filteredBookings.map((b) => (
              <BookingCard
                key={b.id}
                booking={b}
                onCancel={cancelBooking}
                onViewDetails={handleViewDetails}
                onPayNow={handlePayNow}
              />
            ))}
          </div>
        )}

        {/* Payment Modal */}
        {selectedBooking && (
          <PaymentModal
            isOpen={isPaymentModalOpen}
            onClose={() => setIsPaymentModalOpen(false)}
            booking={selectedBooking}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}

        {/* Booking Details & Invoice Receipt Modal */}
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title="Booking Details & Invoice Receipt"
        >
          {selectedBooking && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span className={`badge ${getStatusBadgeClass(selectedBooking.status)}`}>
                    {selectedBooking.status}
                  </span>
                  <span className={`badge ${getStatusBadgeClass(selectedBooking.paymentStatus)}`}>
                    {selectedBooking.paymentStatus === 'Paid' ? '✓ Paid' : selectedBooking.paymentStatus || 'Unpaid'}
                  </span>
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ID: {selectedBooking.id}</span>
              </div>

              <div style={{ background: 'var(--bg-main)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.75rem', color: 'var(--text-main)' }}>
                  {selectedBooking.serviceName}
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.9rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>Pet Name:</span>
                    <strong>🐾 {selectedBooking.petName}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>Total Price:</span>
                    <strong style={{ color: 'var(--primary)' }}>{formatCurrency(selectedBooking.price)}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>Date:</span>
                    <strong>{formatDate(selectedBooking.date)}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>Time Slot:</span>
                    <strong>{selectedBooking.time}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>Owner Name:</span>
                    <strong>{selectedBooking.ownerName}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>Payment Method:</span>
                    <strong>{selectedBooking.paymentMethod || 'Pay on Arrival'}</strong>
                  </div>
                </div>

                {selectedBooking.transactionId && (
                  <div style={{ marginTop: '0.75rem', padding: '0.5rem', background: '#FFFFFF', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                    <span>Transaction ID: <strong>{selectedBooking.transactionId}</strong></span>
                  </div>
                )}

                {selectedBooking.notes && (
                  <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'block' }}>Notes & Instructions:</span>
                    <p style={{ fontSize: '0.9rem', fontStyle: 'italic', margin: '0.2rem 0 0' }}>"{selectedBooking.notes}"</p>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                {selectedBooking.paymentStatus !== 'Paid' && selectedBooking.status !== 'Cancelled' ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={CreditCard}
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      handlePayNow(selectedBooking);
                    }}
                  >
                    Pay {formatCurrency(selectedBooking.price)} Now
                  </Button>
                ) : (
                  <span style={{ color: 'var(--accent-emerald)', fontSize: '0.85rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <CheckCircle2 size={16} /> Official Invoice Settled
                  </span>
                )}

                <Button variant="outline" size="sm" onClick={() => setIsDetailModalOpen(false)}>Close</Button>
              </div>
            </div>
          )}
        </Modal>

      </main>
    </div>
  );
};
