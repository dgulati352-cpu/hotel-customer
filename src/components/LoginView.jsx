import React, { useState } from 'react';
import { Utensils, Mail, Hash, ChevronRight, Lock } from 'lucide-react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const LoginView = ({ onLogin }) => {
  const [loginType, setLoginType] = useState('table'); // 'table' or 'email'
  const [inputValue, setInputValue] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setError('');

    if (loginType === 'email') {
      if (!password) {
        setError('Password is required');
        return;
      }
      setLoading(true);
      try {
        await signInWithEmailAndPassword(auth, inputValue, password);
        onLogin({ role: 'admin', identifier: inputValue });
      } catch (err) {
        console.error("Login error:", err);
        setError('Invalid email or password');
      } finally {
        setLoading(false);
      }
    } else {
      onLogin({ role: 'customer', identifier: inputValue });
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      onLogin({ role: 'admin', identifier: result.user.email });
    } catch (err) {
      console.error("Google login error:", err);
      setError('Failed to login with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 0' }}>
      <div className="glass-panel" style={{ maxWidth: '400px', width: '100%', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: '0.5rem' }}>Login to Continue</h2>
          <p style={{ color: 'var(--text-muted)' }}>Please select your login type</p>
        </div>

        <div className="tabs" style={{ display: 'flex', background: 'var(--bg-dark)', padding: '0.25rem', borderRadius: 'var(--radius-md)' }}>
          <button 
            className={`tab-btn ${loginType === 'table' ? 'active' : ''}`}
            style={{ flex: 1, textAlign: 'center', borderRadius: 'var(--radius-sm)', margin: 0, padding: '0.75rem' }}
            onClick={() => { setLoginType('table'); setInputValue(''); setError(''); }}
          >
            Customer
          </button>
          <button 
            className={`tab-btn ${loginType === 'email' ? 'active' : ''}`}
            style={{ flex: 1, textAlign: 'center', borderRadius: 'var(--radius-sm)', margin: 0, padding: '0.75rem' }}
            onClick={() => { setLoginType('email'); setInputValue(''); setPassword(''); setError(''); }}
          >
            Staff
          </button>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label>{loginType === 'table' ? 'Table Number' : 'Email Address'}</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                {loginType === 'table' ? <Hash size={18} /> : <Mail size={18} />}
              </div>
              <input 
                type={loginType === 'email' ? 'email' : 'number'} 
                placeholder={loginType === 'table' ? 'Enter your table number (e.g. 5)' : 'staff@flavorfusion.com'}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                style={{ paddingLeft: '2.75rem', width: '100%' }}
                required={loginType !== 'email'} 
              />
            </div>
          </div>
          
          {loginType === 'email' && (
            <div className="form-group" style={{ margin: 0 }}>
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '2.75rem', width: '100%' }}
                />
              </div>
            </div>
          )}

          {error && <div style={{ color: 'var(--accent-danger)', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem' }} disabled={loading}>
            {loading ? 'Logging in...' : (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                Continue <ChevronRight size={18} />
              </span>
            )}
          </button>

          {loginType === 'email' && (
            <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>Or</p>
              <button type="button" onClick={handleGoogleLogin} className="btn-outline" style={{ width: '100%', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }} disabled={loading}>
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: 18, height: 18 }} />
                Sign in with Google
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginView;
