import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { usePetly } from '../context/PetlyContext';
import { FormInput, FormSelect } from '../components/FormInput';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { PaymentModal } from '../components/PaymentModal';
import { Calendar, Clock, PawPrint, User, Phone, CheckCircle2, ArrowRight, CreditCard, Banknote, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export const BookService = () => {
  const { pets, services, user, addBooking, payForBooking } = usePetly();
  const navigate = useNavigate();
  const location = useLocation();

  const preselectedServiceId = location.state?.serviceId || services[0]?.id || '';
  const preselectedPetId = pets[0]?.id || '';

  const [formData, setFormData] = useState({
    serviceId: preselectedServiceId,
    petId: preselectedPetId,
    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    time: '10:00 AM',
    ownerName: user?.name || '',
    phone: user?.phone || '',
    notes: '',
    paymentOption: 'pay_now' // pay_now or pay_later
  });

  const [createdBooking, setCreatedBooking] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        ownerName: prev.ownerName || user.name || '',
        phone: prev.phone || user.phone || ''
      }));
    }
  }, [user]);

  const selectedService = services.find(s => s.id === formData.serviceId) || services[0];
  const selectedPet = pets.find(p => p.id === formData.petId);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.petId) {
      setError('Please select or add a pet first before booking!');
      return;
    }
    if (!formData.serviceId) {
      setError('Please select a pet service');
      return;
    }
    if (!formData.date || !formData.time) {
      setError('Please select preferred Date and Time slot');
      return;
    }
    if (!formData.ownerName || !formData.phone) {
      setError('Please provide Owner Name and Contact Phone Number');
      return;
    }

    if (formData.paymentOption === 'pay_now') {
      // Create provisional booking and open payment modal
      const bookingResult = await addBooking({
        ...formData,
        payNow: false // Will mark as paid after modal completes
      });
      setCreatedBooking(bookingResult);
      setIsPaymentModalOpen(true);
    } else {
      // Pay later choice
      const bookingResult = await addBooking({
        ...formData,
        payNow: false,
        paymentMethod: 'Pay on Arrival'
      });
      setCreatedBooking(bookingResult);
      setIsSuccessModalOpen(true);
      triggerConfetti();
    }
  };

  const handlePaymentSuccess = (paymentInfo) => {
    if (createdBooking) {
      payForBooking(createdBooking.id, {
        amount: paymentInfo.amount,
        method: paymentInfo.method
      });
      setCreatedBooking(prev => ({
        ...prev,
        paymentStatus: 'Paid',
        paymentMethod: paymentInfo.method
      }));
    }
    setIsSuccessModalOpen(true);
    triggerConfetti();
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log('Confetti effect triggered');
    }
  };

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', padding: '3rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="badge badge-info" style={{ marginBottom: '0.5rem' }}>EASY SCHEDULING & CHECKOUT</span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--text-main)' }}>
            Book & Pay for Pet Service
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Fill out the details below to schedule care with our verified pet specialists.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '2rem', alignItems: 'flex-start' }}>
          
          {/* Booking Form Card */}
          <div className="card" style={{ padding: '2rem' }}>
            {error && (
              <div style={{
                background: 'var(--accent-rose-light)',
                color: 'var(--accent-rose)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: '600',
                marginBottom: '1.25rem'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              
              {/* Select Service */}
              <FormSelect
                label="Select Pet Care Service"
                name="serviceId"
                value={formData.serviceId}
                onChange={handleChange}
                options={services.map(s => ({
                  value: s.id,
                  label: `${s.name} - ${formatCurrency(s.price)} (${s.duration})`
                }))}
                required
              />

              {/* Select Pet */}
              {pets.length === 0 ? (
                <div style={{
                  background: 'var(--accent-amber-light)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.25rem',
                  textAlign: 'center'
                }}>
                  <p style={{ fontSize: '0.85rem', color: '#B45309', fontWeight: '600', marginBottom: '0.5rem' }}>
                    No registered pets found. Please add a pet profile first.
                  </p>
                  <Button size="sm" variant="secondary" onClick={() => navigate('/pets')}>
                    Add Pet Profile
                  </Button>
                </div>
              ) : (
                <FormSelect
                  label="Select Pet"
                  name="petId"
                  value={formData.petId}
                  onChange={handleChange}
                  options={pets.map(p => ({
                    value: p.id,
                    label: `🐾 ${p.name} (${p.breed || p.type})`
                  }))}
                  icon={PawPrint}
                  required
                />
              )}

              {/* Date & Time Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <FormInput
                  label="Select Date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  icon={Calendar}
                  required
                />

                <FormSelect
                  label="Select Time Slot"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  icon={Clock}
                  options={[
                    { value: '09:00 AM', label: '09:00 AM' },
                    { value: '10:00 AM', label: '10:00 AM' },
                    { value: '11:30 AM', label: '11:30 AM' },
                    { value: '02:00 PM', label: '02:00 PM' },
                    { value: '04:00 PM', label: '04:00 PM' },
                    { value: '06:00 PM', label: '06:00 PM' }
                  ]}
                  required
                />
              </div>

              {/* Owner Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <FormInput
                  label="Owner Name"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  placeholder="e.g. Alex Morgan"
                  icon={User}
                  required
                />

                <FormInput
                  label="Phone Number"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +1 (555) 234-5678"
                  icon={Phone}
                  required
                />
              </div>

              {/* Payment Option Selector */}
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Payment Preference</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentOption: 'pay_now' })}
                    style={{
                      padding: '0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: `2px solid ${formData.paymentOption === 'pay_now' ? 'var(--primary)' : 'var(--border-color)'}`,
                      background: formData.paymentOption === 'pay_now' ? 'var(--primary-light)' : '#FFFFFF',
                      color: formData.paymentOption === 'pay_now' ? 'var(--primary)' : 'var(--text-main)',
                      fontWeight: '700',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      justify: 'center'
                    }}
                  >
                    <CreditCard size={18} /> Pay Online Now
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentOption: 'pay_later' })}
                    style={{
                      padding: '0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: `2px solid ${formData.paymentOption === 'pay_later' ? 'var(--primary)' : 'var(--border-color)'}`,
                      background: formData.paymentOption === 'pay_later' ? 'var(--primary-light)' : '#FFFFFF',
                      color: formData.paymentOption === 'pay_later' ? 'var(--primary)' : 'var(--text-main)',
                      fontWeight: '700',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      justify: 'center'
                    }}
                  >
                    <Banknote size={18} /> Pay on Arrival
                  </button>
                </div>
              </div>

              {/* Additional Notes */}
              <div className="form-group">
                <label className="form-label">Additional Instructions / Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="e.g. Special shampoo requirements, pickup instructions..."
                  className="form-textarea"
                  rows={2}
                />
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <Button type="submit" variant="primary" fullWidth size="lg">
                  {formData.paymentOption === 'pay_now' ? 'Proceed to Payment Gateway' : 'Confirm Booking (Pay Later)'}
                </Button>
              </div>

            </form>
          </div>

          {/* Booking Summary Card */}
          <div className="card" style={{ padding: '1.5rem', background: '#FFFFFF' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
              Booking & Payment Summary
            </h3>

            {selectedService && (
              <div>
                <img
                  src={selectedService.image}
                  alt={selectedService.name}
                  style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}
                />

                <h4 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 0.25rem' }}>
                  {selectedService.name}
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  {selectedService.shortDescription}
                </p>

                <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Selected Pet:</span>
                    <strong style={{ color: 'var(--text-main)' }}>{selectedPet ? selectedPet.name : 'None'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Duration:</span>
                    <strong>{selectedService.duration}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Payment Mode:</span>
                    <strong>{formData.paymentOption === 'pay_now' ? '💳 Pay Online' : '💵 Pay Later'}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                  <span style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-main)' }}>Total Price:</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>
                    {formatCurrency(selectedService.price)}
                  </span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Payment Modal */}
        {createdBooking && (
          <PaymentModal
            isOpen={isPaymentModalOpen}
            onClose={() => setIsPaymentModalOpen(false)}
            booking={createdBooking}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}

        {/* Confirmation Success Modal */}
        <Modal
          isOpen={isSuccessModalOpen}
          onClose={() => {
            setIsSuccessModalOpen(false);
            navigate('/bookings');
          }}
          title="Booking Confirmed! 🎉"
        >
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--accent-emerald-light)',
              color: 'var(--accent-emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <CheckCircle2 size={36} />
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
              Your Service is Booked!
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              We have saved your appointment details in <strong>My Bookings</strong>.
            </p>

            {createdBooking && (
              <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'left', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                <p><strong>Booking Reference:</strong> {createdBooking.id}</p>
                <p><strong>Service:</strong> {createdBooking.serviceName}</p>
                <p><strong>Pet:</strong> {createdBooking.petName}</p>
                <p><strong>Date & Time:</strong> {createdBooking.date} at {createdBooking.time}</p>
                <p><strong>Payment Status:</strong> <span className={`badge ${createdBooking.paymentStatus === 'Paid' ? 'badge-success' : 'badge-warning'}`}>{createdBooking.paymentStatus || 'Unpaid'}</span></p>
                {createdBooking.transactionId && <p><strong>Transaction ID:</strong> {createdBooking.transactionId}</p>}
              </div>
            )}

            <Button
              variant="primary"
              fullWidth
              icon={ArrowRight}
              onClick={() => {
                setIsSuccessModalOpen(false);
                navigate('/bookings');
              }}
            >
              Go to My Bookings
            </Button>
          </div>
        </Modal>

      </div>
    </div>
  );
};
