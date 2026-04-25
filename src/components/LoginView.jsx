import React, { useState } from 'react';
import { Utensils, Mail, Hash, ChevronRight } from 'lucide-react';

const LoginView = ({ onLogin }) => {
  const [loginType, setLoginType] = useState('table'); // 'table' or 'email'
  const [inputValue, setInputValue] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    if (loginType === 'email') {
      onLogin({ role: 'admin', identifier: inputValue });
    } else {
      onLogin({ role: 'customer', identifier: inputValue });
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
            onClick={() => { setLoginType('table'); setInputValue(''); }}
          >
            Customer
          </button>
          <button 
            className={`tab-btn ${loginType === 'email' ? 'active' : ''}`}
            style={{ flex: 1, textAlign: 'center', borderRadius: 'var(--radius-sm)', margin: 0, padding: '0.75rem' }}
            onClick={() => { setLoginType('email'); setInputValue(''); }}
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
                required
              />
            </div>
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem' }}>
            Continue <ChevronRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginView;
