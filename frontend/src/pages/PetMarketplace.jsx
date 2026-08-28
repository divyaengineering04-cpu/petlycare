import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { usePetly } from '../context/PetlyContext';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { FormInput, FormSelect } from '../components/FormInput';
import { Search, PlusCircle, ShoppingBag, ShieldCheck, MapPin, Phone, Heart, Sparkles, CheckCircle2, DollarSign, Tag, Info } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export const PetMarketplace = () => {
  const { marketplacePets, addMarketplaceListing, buyMarketplacePet, user, isAuthenticated } = usePetly();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priceFilter, setPriceFilter] = useState('All');

  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [buyPaymentMethod, setBuyPaymentMethod] = useState('upi');

  const [sellForm, setSellForm] = useState({
    title: '',
    type: 'Dog',
    breed: '',
    age: '2 Months',
    gender: 'Male',
    price: 15000,
    location: 'Bengaluru, Karnataka',
    phone: user?.phone || '+91 98765 43210',
    image: '',
    description: ''
  });

  const categories = ['All', 'Dog', 'Cat', 'Bird', 'Rabbit'];

  const filteredPets = marketplacePets.filter((pet) => {
    const matchesSearch = pet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pet.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || pet.type === categoryFilter;

    let matchesPrice = true;
    if (priceFilter === 'under_10k') matchesPrice = pet.price < 10000;
    else if (priceFilter === '10k_20k') matchesPrice = pet.price >= 10000 && pet.price <= 20000;
    else if (priceFilter === 'above_20k') matchesPrice = pet.price > 20000;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const handleOpenBuy = (pet) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/marketplace' } });
      return;
    }
    setSelectedPet(pet);
    setIsBuyModalOpen(true);
  };

  const handleConfirmBuy = (e) => {
    e.preventDefault();
    if (!selectedPet) return;

    buyMarketplacePet(selectedPet);
    setIsBuyModalOpen(false);

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

  const handleSellSubmit = (e) => {
    e.preventDefault();
    if (!sellForm.title || !sellForm.breed) return;

    const defaultImage = sellForm.image || (
      sellForm.type === 'Dog' ? 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&q=80&w=600'
      : sellForm.type === 'Cat' ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600'
      : 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&q=80&w=600'
    );

    addMarketplaceListing({
      ...sellForm,
      price: Number(sellForm.price),
      image: defaultImage
    });

    setIsSellModalOpen(false);
    setSellForm({
      title: '',
      type: 'Dog',
      breed: '',
      age: '2 Months',
      gender: 'Male',
      price: 15000,
      location: 'Bengaluru, Karnataka',
      phone: user?.phone || '+91 98765 43210',
      image: '',
      description: ''
    });
  };

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', padding: '3rem 0 5rem' }}>
      <div className="container">
        
        {/* Banner Section */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, #1E1B4B 0%, #4F46E5 100%)',
          color: '#FFFFFF',
          padding: '3rem 2.5rem',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '3rem',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '2rem'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '0.75rem'
            }}>
              <Sparkles size={16} /> VERIFIED PET MARKETPLACE INDIA
            </div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: '800', margin: '0 0 0.5rem', color: '#FFFFFF' }}>
              Buy, Sell & Adopt Healthy Pets
            </h1>
            <p style={{ color: '#EEF2FF', fontSize: '1.05rem', margin: 0, maxWidth: '600px' }}>
              Explore KCI certified puppies, Persian kittens, aviary birds, and rescued pets from verified breeders and owners across India.
            </p>
          </div>

          <Button
            variant="secondary"
            size="lg"
            icon={PlusCircle}
            onClick={() => {
              if (!isAuthenticated) {
                navigate('/login', { state: { from: '/marketplace' } });
                return;
              }
              setIsSellModalOpen(true);
            }}
          >
            List Your Pet for Sale
          </Button>
        </div>

        {/* Filter & Search Controls */}
        <div className="card" style={{ marginBottom: '2.5rem', padding: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            
            {/* Search */}
            <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search pets, breeds, city (e.g. Golden Retriever, Bengaluru)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '40px' }}
              />
            </div>

            {/* Category Pills */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    background: categoryFilter === cat ? 'var(--primary)' : 'var(--bg-main)',
                    color: categoryFilter === cat ? '#FFFFFF' : 'var(--text-muted)',
                    border: '1px solid var(--border-color)',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Price Dropdown */}
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="form-select"
              style={{ width: 'auto', minWidth: '160px' }}
            >
              <option value="All">All Prices</option>
              <option value="under_10k">Under ₹10,000</option>
              <option value="10k_20k">₹10,000 - ₹20,000</option>
              <option value="above_20k">Above ₹20,000</option>
            </select>

          </div>
        </div>

        {/* Pet Cards Grid */}
        {filteredPets.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
            <ShoppingBag size={48} style={{ color: 'var(--text-light)', margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>No Pets Found</h3>
            <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search keywords or price filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3">
            {filteredPets.map((pet) => (
              <div key={pet.id} className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', padding: 0 }}>
                
                <div style={{ position: 'relative', height: '220px', width: '100%' }}>
                  <img
                    src={pet.image}
                    alt={pet.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />

                  <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '0.4rem' }}>
                    {pet.certified && (
                      <span className="badge badge-success" style={{ boxShadow: 'var(--shadow-md)' }}>
                        <ShieldCheck size={12} /> KCI Verified
                      </span>
                    )}
                    {pet.price === 0 && (
                      <span className="badge badge-warning" style={{ boxShadow: 'var(--shadow-md)' }}>
                        ❤️ Free Adoption
                      </span>
                    )}
                  </div>

                  <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    backdropFilter: 'blur(6px)',
                    color: '#FFF',
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    fontWeight: '700'
                  }}>
                    {pet.age} • {pet.gender}
                  </div>
                </div>

                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                      {pet.title}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                      {pet.breed}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                      <MapPin size={14} style={{ color: 'var(--primary)' }} />
                      <span>{pet.location}</span>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {pet.description}
                    </p>
                  </div>

                  <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Selling Price</span>
                      <span style={{ fontSize: '1.3rem', fontWeight: '800', color: pet.price === 0 ? 'var(--accent-emerald)' : 'var(--primary)' }}>
                        {pet.price === 0 ? 'FREE ADOPTION' : formatCurrency(pet.price)}
                      </span>
                    </div>

                    <Button
                      variant={pet.price === 0 ? 'secondary' : 'primary'}
                      size="sm"
                      onClick={() => handleOpenBuy(pet)}
                    >
                      {pet.price === 0 ? 'Adopt Pet' : 'Buy / Reserve'}
                    </Button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* List Pet for Sale Modal */}
        <Modal
          isOpen={isSellModalOpen}
          onClose={() => setIsSellModalOpen(false)}
          title="List Your Pet for Sale or Adoption"
          maxWidth="580px"
        >
          <form onSubmit={handleSellSubmit}>
            <FormInput
              label="Pet Listing Title"
              name="title"
              value={sellForm.title}
              onChange={(e) => setSellForm({ ...sellForm, title: e.target.value })}
              placeholder="e.g. Purebred Golden Retriever Puppy"
              required
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <FormSelect
                label="Pet Category"
                name="type"
                value={sellForm.type}
                onChange={(e) => setSellForm({ ...sellForm, type: e.target.value })}
                options={[
                  { value: 'Dog', label: '🐶 Dog' },
                  { value: 'Cat', label: '🐱 Cat' },
                  { value: 'Bird', label: '🦜 Bird' },
                  { value: 'Rabbit', label: '🐰 Rabbit' }
                ]}
              />

              <FormInput
                label="Breed"
                name="breed"
                value={sellForm.breed}
                onChange={(e) => setSellForm({ ...sellForm, breed: e.target.value })}
                placeholder="e.g. Labrador / Persian"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <FormInput
                label="Age"
                name="age"
                value={sellForm.age}
                onChange={(e) => setSellForm({ ...sellForm, age: e.target.value })}
                placeholder="e.g. 3 Months"
                required
              />

              <FormSelect
                label="Gender"
                name="gender"
                value={sellForm.gender}
                onChange={(e) => setSellForm({ ...sellForm, gender: e.target.value })}
                options={[
                  { value: 'Male', label: 'Male' },
                  { value: 'Female', label: 'Female' },
                  { value: 'Pair', label: 'Pair' }
                ]}
              />

              <FormInput
                label="Price (₹ INR)"
                type="number"
                name="price"
                value={sellForm.price}
                onChange={(e) => setSellForm({ ...sellForm, price: e.target.value })}
                placeholder="0 for Free Adoption"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <FormInput
                label="City / Location"
                name="location"
                value={sellForm.location}
                onChange={(e) => setSellForm({ ...sellForm, location: e.target.value })}
                placeholder="e.g. Bengaluru, Karnataka"
                required
              />

              <FormInput
                label="Contact Phone"
                name="phone"
                value={sellForm.phone}
                onChange={(e) => setSellForm({ ...sellForm, phone: e.target.value })}
                placeholder="+91 98765 43210"
                required
              />
            </div>

            <FormInput
              label="Pet Image URL (Optional)"
              name="image"
              value={sellForm.image}
              onChange={(e) => setSellForm({ ...sellForm, image: e.target.value })}
              placeholder="https://..."
            />

            <div className="form-group">
              <label className="form-label">Description & Health Notes</label>
              <textarea
                name="description"
                value={sellForm.description}
                onChange={(e) => setSellForm({ ...sellForm, description: e.target.value })}
                placeholder="Details about health status, vaccination, KCI registration, diet..."
                className="form-textarea"
                rows={3}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <Button variant="outline" onClick={() => setIsSellModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary">Publish Pet Listing</Button>
            </div>
          </form>
        </Modal>

        {/* Buy / Reserve Pet Modal */}
        <Modal
          isOpen={isBuyModalOpen}
          onClose={() => setIsBuyModalOpen(false)}
          title={selectedPet?.price === 0 ? "❤️ Adopt Pet Confirmation" : "🛒 Buy & Reserve Pet"}
        >
          {selectedPet && (
            <div>
              <div style={{ background: 'var(--bg-main)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                  <img
                    src={selectedPet.image}
                    alt={selectedPet.title}
                    style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                  />
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0 }}>{selectedPet.title}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0' }}>{selectedPet.breed} • {selectedPet.age}</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '700', margin: 0 }}>📍 {selectedPet.location}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                  <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>Total Amount:</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary)' }}>
                    {selectedPet.price === 0 ? 'FREE ADOPTION' : formatCurrency(selectedPet.price)}
                  </span>
                </div>
              </div>

              {selectedPet.price > 0 && (
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label">Payment Gateway Mode</label>
                  <select
                    value={buyPaymentMethod}
                    onChange={(e) => setBuyPaymentMethod(e.target.value)}
                    className="form-select"
                  >
                    <option value="upi">📱 UPI Instant (GPay / PhonePe / Paytm)</option>
                    <option value="card">💳 Debit / Credit Card (RuPay, Visa)</option>
                    <option value="cod">💵 Pay Seller on Home Delivery</option>
                  </select>
                </div>
              )}

              <div style={{ background: 'var(--primary-light)', padding: '0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '600' }}>
                ✓ Once confirmed, this pet will automatically be added to your <strong>My Pets</strong> profile tab!
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <Button variant="outline" onClick={() => setIsBuyModalOpen(false)}>Cancel</Button>
                <Button variant="primary" onClick={handleConfirmBuy}>
                  {selectedPet.price === 0 ? 'Confirm Free Adoption' : `Pay ${formatCurrency(selectedPet.price)} & Reserve`}
                </Button>
              </div>
            </div>
          )}
        </Modal>

      </div>
    </div>
  );
};
