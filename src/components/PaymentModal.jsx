import React, { useState } from 'react';
import { CreditCard, Smartphone, CheckCircle, Banknote } from 'lucide-react';

const PaymentModal = ({ total, onClose, onSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi', 'card'
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePay = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Mock processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Close modal and trigger success after a brief moment showing the checkmark
      setTimeout(() => {
        onSuccess({ method: paymentMethod === 'upi' ? 'UPI / QR' : paymentMethod === 'card' ? 'Credit/Debit Card' : 'Pay at Counter' });
      }, 1500);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="modal-overlay">
        <div className="modal-content glass-panel" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <CheckCircle size={64} color="var(--accent-success)" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ color: 'var(--accent-success)', marginBottom: '0.5rem' }}>Payment Successful!</h2>
          <p style={{ color: 'var(--text-muted)' }}>Your order is being sent to the kitchen.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Complete Payment</h2>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Amount to pay</span>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--accent-primary)' }}>₹{total}</div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <button 
            className={`btn-outline ${paymentMethod === 'upi' ? 'active' : ''}`}
            style={{ flex: 1, padding: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', background: paymentMethod === 'upi' ? 'rgba(59, 130, 246, 0.2)' : 'transparent', borderColor: paymentMethod === 'upi' ? 'var(--accent-primary)' : 'var(--border-color)' }}
            onClick={() => setPaymentMethod('upi')}
          >
            <Smartphone size={24} />
            <span style={{ fontSize: '0.85rem' }}>UPI / QR</span>
          </button>
          <button 
            className={`btn-outline ${paymentMethod === 'card' ? 'active' : ''}`}
            style={{ flex: 1, padding: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', background: paymentMethod === 'card' ? 'rgba(59, 130, 246, 0.2)' : 'transparent', borderColor: paymentMethod === 'card' ? 'var(--accent-primary)' : 'var(--border-color)' }}
            onClick={() => setPaymentMethod('card')}
          >
            <CreditCard size={24} />
            <span style={{ fontSize: '0.85rem' }}>Card</span>
          </button>
          <button 
            className={`btn-outline ${paymentMethod === 'cash' ? 'active' : ''}`}
            style={{ flex: 1, padding: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', background: paymentMethod === 'cash' ? 'rgba(59, 130, 246, 0.2)' : 'transparent', borderColor: paymentMethod === 'cash' ? 'var(--accent-primary)' : 'var(--border-color)' }}
            onClick={() => setPaymentMethod('cash')}
          >
            <Banknote size={24} />
            <span style={{ fontSize: '0.85rem' }}>Counter</span>
          </button>
        </div>

        <form onSubmit={handlePay}>
          {paymentMethod === 'upi' ? (
            <div className="form-group">
              <label>UPI ID</label>
              <input type="text" placeholder="username@upi" required />
            </div>
          ) : paymentMethod === 'card' ? (
            <>
              <div className="form-group">
                <label>Card Number</label>
                <input type="text" placeholder="XXXX XXXX XXXX XXXX" required pattern="\d{16}" title="16 digit card number" />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Expiry</label>
                  <input type="text" placeholder="MM/YY" required pattern="\d{2}/\d{2}" />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>CVV</label>
                  <input type="text" placeholder="123" required pattern="\d{3}" />
                </div>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)' }}>
              Please pay ₹{total} at the billing counter after finishing your meal. Your order will be sent to the kitchen immediately.
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" className="btn-outline" style={{ flex: 1 }} onClick={onClose} disabled={isProcessing}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 2 }} disabled={isProcessing}>
              {isProcessing ? 'Processing...' : paymentMethod === 'cash' ? 'Confirm Order' : `Pay ₹${total}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
