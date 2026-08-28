import React, { useState } from 'react';
import { usePetly } from '../context/PetlyContext';
import { ServiceCard } from '../components/ServiceCard';
import { Search, Filter, Sparkles } from 'lucide-react';

export const PetCareServices = () => {
  const { services } = usePetly();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = ['All', 'Grooming', 'Medical', 'Activity', 'Care', 'Transport'];

  const filteredServices = services.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || s.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', padding: '3rem 0 5rem' }}>
      <div className="container">
        
        {/* Header Title */}
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem' }}>
          <span className="badge badge-info" style={{ marginBottom: '0.75rem' }}>PROFESSIONAL PET SERVICES</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
            Explore Pet Care Services
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
            Select from our range of verified pet grooming, vet care, walking, sitting, and transport services.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="card" style={{ marginBottom: '2.5rem', padding: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            
            {/* Search Input */}
            <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search services (e.g. Grooming, Vet...)"
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

          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>No pet services match your filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3">
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
