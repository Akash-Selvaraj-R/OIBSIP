import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying');
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      authAPI.verifyEmail(token)
        .then(() => {
          setStatus('success');
          toast.success('Email verified successfully!');
        })
        .catch(() => {
          setStatus('error');
          toast.error('Verification failed or token expired');
        });
    } else {
      setStatus('error');
    }
  }, [token]);

  return (
    <div className="auth-container">
      <div className="auth-card fade-in" style={{ textAlign: 'center' }}>
        {status === 'verifying' && (
          <>
            <div className="spinner" style={{ margin: '0 auto 1.5rem' }}></div>
            <h2>Verifying your email...</h2>
          </>
        )}
        {status === 'success' && (
          <>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>&#10003;</div>
            <h2 style={{ marginBottom: '1rem' }}>Email Verified!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Your email has been verified. You can now use all features.
            </p>
            <Link to="/dashboard" className="btn btn-primary btn-lg">Go to Dashboard</Link>
          </>
        )}
        {status === 'error' && (
          <>
            <div style={{ fontSize: '4rem', marginBottom: '1rem', color: 'var(--danger)' }}>&#10007;</div>
            <h2 style={{ marginBottom: '1rem' }}>Verification Failed</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              The verification link is invalid or has expired.
            </p>
            <Link to="/login" className="btn btn-primary btn-lg">Go to Login</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
