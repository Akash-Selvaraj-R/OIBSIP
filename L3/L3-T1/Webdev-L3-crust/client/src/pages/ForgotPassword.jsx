import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.forgotPassword({ email });
      setSent(true);
      toast.success('Reset link sent to your email');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <div className="auth-header">
          <Link to="/" className="logo" style={{ fontSize: '2rem', color: 'var(--black)', justifyContent: 'center' }}>
            CRUST<span>.</span><span className="logo-tm" style={{ color: 'var(--black)' }}>TM</span>
          </Link>
          <h1 className="auth-title">FORGOT PASSWORD?</h1>
          <p className="auth-subtitle">Enter your email to receive a reset link</p>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✉</div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontWeight: 500 }}>
              If an account exists with <strong>{email}</strong>, you'll receive a password reset link shortly.
            </p>
            <Link to="/login" className="btn btn-primary">← BACK TO LOGIN</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'SENDING...' : 'SEND RESET LINK'}
            </button>
          </form>
        )}

        <div className="auth-footer">
          Remember your password? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
