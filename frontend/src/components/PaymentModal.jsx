import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { FormInput } from './FormInput';
import { CreditCard, Wallet, Banknote, ShieldCheck, Lock, CheckCircle2, DollarSign } from 'lucide-react';
import { formatCurrency, formatCardNumber } from '../utils/formatters';

export const PaymentModal = ({ isOpen, onClose, booking, onPaymentSuccess }) => {
  const [method, setMethod] = useState('upi'); // upi, card, cash
  const [processing, setProcessing] = useState(false);
  const [cardData, setCardData] = useState({
    cardNumber: '4532 8912 3456 7890',
    expiry: '12/28',
    cvv: '889',
    holderName: booking?.ownerName || 'Alex Morgan'
  });
  const [upiId, setUpiId] = useState('alex@upi');
  const [error, setError] = useState('');

  if (!booking) return null;

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cardNumber') {
      setCardData({ ...cardData, cardNumber: formatCardNumber(value) });
    } else {
      setCardData({ ...cardData, [name]: value });
    }
  };

  const handlePay = (e) => {
    e.preventDefault();
    if (method === 'card') {
      if (!cardData.cardNumber || cardData.cardNumber.length < 16) {
        setError('Please enter a valid 16-digit card number');
        return;
      }
      if (!cardData.expiry || !cardData.cvv) {
        setError('Please complete expiry and CVV');
        return;
      }
    } else if (method === 'upi' && !upiId) {
      setError('Please enter a valid UPI ID (e.g. mobile@upi, name@okaxis)');
      return;
    }

    setError('');
    setProcessing(true);

    setTimeout(() => {
      setProcessing(false);
      const methodLabel = method === 'upi'
        ? `UPI Instant (${upiId})`
        : method === 'card'
        ? `Card (**** ${cardData.cardNumber.slice(-4)})`
        : 'Pay on Arrival (Cash/Card)';

      onPaymentSuccess({
        bookingId: booking.id,
        amount: booking.price,
        method: methodLabel
      });
      onClose();
    }, 1800);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🔒 Indian Payment Gateway Checkout"
      maxWidth="560px"
    >
      <div style={{ marginBottom: '1.25rem' }}>
        {/* Itemized Order Summary */}
        <div style={{
          background: 'var(--primary-light)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Service Booking:</span>
            <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>{booking.serviceName}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Pet:</span>
            <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>🐾 {booking.petName}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px dashed var(--primary)', marginTop: '0.5rem' }}>
            <span style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-main)' }}>Total Amount Payable:</span>
            <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>
              {formatCurrency(booking.price)}
            </span>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <button
            type="button"
            onClick={() => setMethod('upi')}
            style={{
              flex: 1,
              padding: '0.75rem 0.5rem',
              borderRadius: 'var(--radius-md)',
              border: `2px solid ${method === 'upi' ? 'var(--primary)' : 'var(--border-color)'}`,
              background: method === 'upi' ? 'var(--primary-light)' : '#FFFFFF',
              color: method === 'upi' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: '700',
              fontSize: '0.85rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <Wallet size={20} />
            <span>UPI / PhonePe / GPay</span>
          </button>

          <button
            type="button"
            onClick={() => setMethod('card')}
            style={{
              flex: 1,
              padding: '0.75rem 0.5rem',
              borderRadius: 'var(--radius-md)',
              border: `2px solid ${method === 'card' ? 'var(--primary)' : 'var(--border-color)'}`,
              background: method === 'card' ? 'var(--primary-light)' : '#FFFFFF',
              color: method === 'card' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: '700',
              fontSize: '0.85rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <CreditCard size={20} />
            <span>Debit / Credit Card</span>
          </button>

          <button
            type="button"
            onClick={() => setMethod('cash')}
            style={{
              flex: 1,
              padding: '0.75rem 0.5rem',
              borderRadius: 'var(--radius-md)',
              border: `2px solid ${method === 'cash' ? 'var(--primary)' : 'var(--border-color)'}`,
              background: method === 'cash' ? 'var(--primary-light)' : '#FFFFFF',
              color: method === 'cash' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: '700',
              fontSize: '0.85rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <Banknote size={20} />
            <span>Pay on Arrival</span>
          </button>
        </div>

        {error && (
          <div style={{
            background: 'var(--accent-rose-light)',
            color: 'var(--accent-rose)',
            padding: '0.65rem 1rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            fontWeight: '600',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        {/* Dynamic Form based on selected method */}
        <form onSubmit={handlePay}>
          {method === 'upi' && (
            <div>
              <FormInput
                label="UPI ID / VPA (Google Pay, PhonePe, Paytm, BHIM)"
                name="upiId"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="e.g. 9876543210@paytm or alex@okaxis"
                icon={Wallet}
                required
              />
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <span className="badge badge-neutral" style={{ cursor: 'pointer' }} onClick={() => setUpiId('alex@gpay')}>Google Pay</span>
                <span className="badge badge-neutral" style={{ cursor: 'pointer' }} onClick={() => setUpiId('alex@ybl')}>PhonePe</span>
                <span className="badge badge-neutral" style={{ cursor: 'pointer' }} onClick={() => setUpiId('alex@paytm')}>Paytm</span>
              </div>
            </div>
          )}

          {method === 'card' && (
            <div>
              <FormInput
                label="Cardholder Name"
                name="holderName"
                value={cardData.holderName}
                onChange={handleCardChange}
                placeholder="e.g. Alex Morgan"
                required
              />

              <FormInput
                label="Card Number (RuPay, Visa, Mastercard)"
                name="cardNumber"
                value={cardData.cardNumber}
                onChange={handleCardChange}
                placeholder="4532 0000 0000 0000"
                icon={CreditCard}
                required
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <FormInput
                  label="Expiry (MM/YY)"
                  name="expiry"
                  value={cardData.expiry}
                  onChange={handleCardChange}
                  placeholder="12/28"
                  required
                />
                <FormInput
                  label="CVV"
                  type="password"
                  name="cvv"
                  value={cardData.cvv}
                  onChange={handleCardChange}
                  placeholder="•••"
                  required
                />
              </div>
            </div>
          )}

          {method === 'cash' && (
            <div style={{
              background: 'var(--accent-amber-light)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem'
            }}>
              <h4 style={{ color: '#B45309', fontWeight: '700', fontSize: '0.95rem', marginBottom: '0.35rem' }}>
                💵 Cash on Service Delivery
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#78350F', margin: 0, lineHeight: '1.5' }}>
                Pay cash directly to our pet care professional or vet at the time of service.
              </p>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', margin: '1rem 0' }}>
            <Lock size={14} style={{ color: 'var(--accent-emerald)' }} />
            <span>256-bit SSL Bank-Grade Secure Payment Gateway.</span>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            size="lg"
            disabled={processing}
          >
            {processing ? (
              <span>Authorizing ₹ Payment...</span>
            ) : (
              <span>Pay {formatCurrency(booking.price)} Now</span>
            )}
          </Button>
        </form>
      </div>
    </Modal>
  );
};
