import React, { useState } from 'react';
import { usePetly } from '../context/PetlyContext';
import { Sidebar } from '../components/Sidebar';
import { PetCard } from '../components/PetCard';
import { Modal } from '../components/Modal';
import { FormInput, FormSelect } from '../components/FormInput';
import { Button } from '../components/Button';
import { PawPrint, PlusCircle, Dog, Cat, ShieldCheck } from 'lucide-react';
import { DEFAULT_PET_AVATARS } from '../utils/formatters';

export const PetProfile = () => {
  const { pets, addPet, updatePet, deletePet } = usePetly();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState(null);

  const initialForm = {
    name: '',
    type: 'Dog',
    breed: '',
    age: '',
    gender: 'Male',
    weight: '',
    vaccinationStatus: 'Vaccinated',
    image: '',
    notes: ''
  };

  const [formData, setFormData] = useState(initialForm);

  const handleOpenAdd = () => {
    setEditingPet(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pet) => {
    setEditingPet(pet);
    setFormData({
      name: pet.name || '',
      type: pet.type || 'Dog',
      breed: pet.breed || '',
      age: pet.age || '',
      gender: pet.gender || 'Male',
      weight: pet.weight || '',
      vaccinationStatus: pet.vaccinationStatus || 'Vaccinated',
      image: pet.image || '',
      notes: pet.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalImage = formData.image || DEFAULT_PET_AVATARS[formData.type] || DEFAULT_PET_AVATARS.Other;

    if (editingPet) {
      updatePet(editingPet.id, { ...formData, image: finalImage });
    } else {
      addPet({ ...formData, image: finalImage });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)' }}>My Pet Profiles</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Add, update, or manage details and vaccination status for your pets.
            </p>
          </div>

          <Button icon={PlusCircle} onClick={handleOpenAdd}>
            Add New Pet
          </Button>
        </div>

        {pets.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <PawPrint size={48} style={{ color: 'var(--text-light)', margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>No Pets Registered Yet</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Create your first pet profile to get started with bookings & health logs.</p>
            <Button icon={PlusCircle} onClick={handleOpenAdd}>Add Your Pet</Button>
          </div>
        ) : (
          <div className="grid grid-cols-3">
            {pets.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                onEdit={handleOpenEdit}
                onDelete={deletePet}
              />
            ))}
          </div>
        )}

        {/* Add/Edit Pet Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingPet ? `Edit ${editingPet.name}'s Profile` : 'Add New Pet'}
        >
          <form onSubmit={handleSubmit}>
            <FormInput
              label="Pet Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Buddy"
              required
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <FormSelect
                label="Pet Type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                options={[
                  { value: 'Dog', label: '🐶 Dog' },
                  { value: 'Cat', label: '🐱 Cat' },
                  { value: 'Bird', label: '🦜 Bird' },
                  { value: 'Rabbit', label: '🐰 Rabbit' },
                  { value: 'Other', label: '🐾 Other' }
                ]}
              />

              <FormInput
                label="Breed"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                placeholder="e.g. Golden Retriever"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <FormInput
                label="Age (Years)"
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="e.g. 3"
                required
              />

              <FormSelect
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                options={[
                  { value: 'Male', label: 'Male' },
                  { value: 'Female', label: 'Female' }
                ]}
              />

              <FormInput
                label="Weight (kg)"
                type="number"
                step="0.1"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="e.g. 28"
                required
              />
            </div>

            <FormSelect
              label="Vaccination Status"
              name="vaccinationStatus"
              value={formData.vaccinationStatus}
              onChange={handleChange}
              options={[
                { value: 'Vaccinated', label: '✅ Vaccinated' },
                { value: 'Due Soon', label: '⚠️ Vaccination Due Soon' },
                { value: 'Not Vaccinated', label: '❌ Not Vaccinated' }
              ]}
            />

            <FormInput
              label="Profile Image URL (Optional)"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://..."
              helpText="Leave empty to use default pet avatar"
            />

            <div className="form-group">
              <label className="form-label">Special Notes / Medical Details</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="e.g. Friendly, allergic to chicken, loves squeaky toys"
                className="form-textarea"
                rows={3}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary">
                {editingPet ? 'Save Changes' : 'Add Pet Profile'}
              </Button>
            </div>
          </form>
        </Modal>

      </main>
    </div>
  );
};
