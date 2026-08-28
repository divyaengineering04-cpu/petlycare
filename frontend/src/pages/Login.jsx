import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { usePetly } from '../context/PetlyContext';
import { FormInput } from '../components/FormInput';
import { Button } from '../components/Button';
import { PawPrint, Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';

export const Login = () => {
  const { login } = usePetly();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState(location.state?.verificationMessage || '');

  const from = location.state?.from || '/dashboard';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
    if (message) setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in both Email and Password');
      return;
    }

    const res = await login(formData.email, formData.password);
    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setError(res.message || 'Invalid credentials');
    }
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      background: 'radial-gradient(circle at 50% 30%, rgba(99, 102, 241, 0.08) 0%, rgba(248, 250, 252, 1) 100%)'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-amber) 100%)',
            color: '#FFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: 'var(--shadow-md)'
          }}>
            <PawPrint size={28} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 0.5rem' }}>
            Welcome Back to Petly
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Sign in to manage your pets & service appointments
          </p>
        </div>

        {error && (
          <div style={{
            background: 'var(--accent-rose-light)',
            color: 'var(--accent-rose)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            fontWeight: '600',
            marginBottom: '1.25rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {message && (
          <div style={{ background: 'var(--accent-emerald-light)', color: 'var(--accent-emerald)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', fontWeight: '600', marginBottom: '1.25rem', textAlign: 'center', wordBreak: 'break-word' }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <FormInput
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g. alex@petly.com"
            icon={Mail}
            required
          />

          <div style={{ position: 'relative' }}>
            <FormInput
              label="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              icon={Lock}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '38px',
                color: 'var(--text-muted)',
                padding: '0.2rem'
              }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div style={{ margin: '1.5rem 0' }}>
            <Button type="submit" variant="primary" fullWidth size="lg" icon={LogIn}>
              Log In to Dashboard
            </Button>
          </div>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
          Don't have a Petly account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '700' }}>
            Register Now
          </Link>
        </p>

      </div>
    </div>
  );
};
