import React, { useState } from 'react';
import { usePetly } from '../context/PetlyContext';
import { Sidebar } from '../components/Sidebar';
import { ReminderCard } from '../components/ReminderCard';
import { Modal } from '../components/Modal';
import { FormInput, FormSelect } from '../components/FormInput';
import { Button } from '../components/Button';
import { Heart, PlusCircle, Syringe, Pill, Calendar, ShieldCheck } from 'lucide-react';
import { formatDate } from '../utils/formatters';

export const PetHealth = () => {
  const { reminders, pets, addReminder, deleteReminder, toggleReminderStatus } = usePetly();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    petId: pets[0]?.id || '',
    title: '',
    type: 'Vaccination',
    dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
    time: '09:00 AM',
    notes: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) return;
    addReminder(formData);
    setIsModalOpen(false);
    setFormData({
      petId: pets[0]?.id || '',
      title: '',
      type: 'Vaccination',
      dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      time: '09:00 AM',
      notes: ''
    });
  };

  const nextVaccine = reminders.find(r => r.type === 'Vaccination' && r.status === 'Active');

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)' }}>Pet Health & Medication Reminders</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Track vaccination booster dates and daily medication routines.
            </p>
          </div>

          <Button icon={PlusCircle} onClick={() => setIsModalOpen(true)}>
            Add Health Reminder
          </Button>
        </div>

        {/* Highlights Banner */}
        <div className="grid grid-cols-2" style={{ marginBottom: '2rem' }}>
          <div className="card" style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: '#FFF' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.75rem', borderRadius: '14px' }}>
                <Syringe size={28} />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  NEXT UPCOMING VACCINATION
                </span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', margin: '0.2rem 0' }}>
                  {nextVaccine ? `${nextVaccine.title} (${nextVaccine.petName})` : 'All Vaccines Up to Date'}
                </h3>
                <p style={{ fontSize: '0.85rem', margin: 0, opacity: 0.9 }}>
                  {nextVaccine ? `Due on ${formatDate(nextVaccine.dueDate)} at ${nextVaccine.time}` : 'Great job maintaining health schedules!'}
                </p>
              </div>
            </div>
          </div>

          <div className="card" style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', color: '#FFF' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.75rem', borderRadius: '14px' }}>
                <Pill size={28} />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  ACTIVE HEALTH LOGS
                </span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', margin: '0.2rem 0' }}>
                  {reminders.filter(r => r.status === 'Active').length} Active Reminders
                </h3>
                <p style={{ fontSize: '0.85rem', margin: 0, opacity: 0.9 }}>
                  {reminders.filter(r => r.status === 'Completed').length} Logged Tasks Completed
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reminders List */}
        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-main)' }}>
          All Health Schedules
        </h3>

        {reminders.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <Heart size={40} style={{ color: 'var(--text-light)', margin: '0 auto 1rem' }} />
            <p style={{ color: 'var(--text-muted)' }}>No reminders set. Add your pet's vaccination or medication date!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {reminders.map((r) => (
              <ReminderCard
                key={r.id}
                reminder={r}
                onToggle={toggleReminderStatus}
                onDelete={deleteReminder}
              />
            ))}
          </div>
        )}

        {/* Add Reminder Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add Health & Medicine Reminder"
        >
          <form onSubmit={handleSubmit}>
            <FormSelect
              label="Select Pet"
              name="petId"
              value={formData.petId}
              onChange={handleChange}
              options={pets.map(p => ({
                value: p.id,
                label: `🐾 ${p.name}`
              }))}
              required
            />

            <FormInput
              label="Reminder Title / Drug Name"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Rabies Booster Shot, Flea Pill"
              required
            />

            <FormSelect
              label="Reminder Category"
              name="type"
              value={formData.type}
              onChange={handleChange}
              options={[
                { value: 'Vaccination', label: '💉 Vaccination Booster' },
                { value: 'Medication', label: '💊 Daily / Periodic Medication' },
                { value: 'Checkup', label: '🩺 Routine Vet Visit' }
              ]}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <FormInput
                label="Due Date"
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
              />

              <FormInput
                label="Time"
                type="text"
                name="time"
                value={formData.time}
                onChange={handleChange}
                placeholder="e.g. 09:00 AM"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Notes & Clinic Info</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="e.g. Doctor's note, dosage instruction..."
                className="form-textarea"
                rows={3}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary">Add Reminder</Button>
            </div>
          </form>
        </Modal>

      </main>
    </div>
  );
};
