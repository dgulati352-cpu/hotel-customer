import React, { useState } from 'react';
import { Search, Utensils } from 'lucide-react';

const getStatusProgress = (status) => {
  const s = (status || '').toLowerCase();
  if (s === 'delivered' || s === 'completed' || s === 'picked up' || s === 'ready') return 3;
  if (s === 'preparing' || s === 'prepared') return 2;
  return 1; // accepted / pending
};

const OrderProgressBar = ({ status }) => {
  const step = getStatusProgress(status);
  const percentage = step === 1 ? 33 : step === 2 ? 66 : 100;
  const label = step === 1 ? "Order Accepted" : step === 2 ? "Preparing Food" : "Ready / Picked Up";

  return (
    <div style={{ marginTop: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.8rem', fontWeight: 600 }}>
        <span style={{ color: step >= 1 ? 'var(--accent-primary)' : 'var(--text-muted)' }}>Accepted</span>
        <span style={{ color: step >= 2 ? 'var(--accent-primary)' : 'var(--text-muted)' }}>Preparing</span>
        <span style={{ color: step === 3 ? 'var(--accent-success)' : 'var(--text-muted)' }}>Picked Up</span>
      </div>
      
      <div style={{ 
        width: '100%', 
        height: '12px', 
        background: 'rgba(0, 0, 0, 0.05)', 
        borderRadius: '999px', 
        overflow: 'hidden',
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)'
      }}>
        <div className="progressive-bar-fill" style={{ 
          width: `${percentage}%`, 
          height: '100%', 
          background: step === 3 ? 'var(--accent-success)' : 'var(--accent-primary)',
          transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative'
        }}>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
        Current Status: <span style={{ color: step === 3 ? 'var(--accent-success)' : 'var(--text-color)', fontWeight: 600 }}>{label}</span>
      </div>
    </div>
  );
};

const OrderTrackingView = ({ orders }) => {
  const [searchTable, setSearchTable] = useState('');
  
  const currentTableOrders = orders.filter(o => String(o.table_number || o.tableNumber) === String(searchTable));

  return (
    <div className="glass-panel" style={{ maxWidth: '800px', margin: '2rem auto', padding: '2rem' }}>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '1.8rem', marginBottom: '1rem' }}>
          <Utensils size={28} />
          Track Your Order
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>Enter your table number to view live status of your delicious meals.</p>
      </div>

      <div className="form-group" style={{ marginBottom: '3rem', maxWidth: '400px', margin: '0 auto 3rem auto' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="number" 
              placeholder="Table No (e.g. 5)" 
              value={searchTable}
              onChange={(e) => setSearchTable(e.target.value)}
              style={{ paddingLeft: '3rem', padding: '1rem 1rem 1rem 3rem', fontSize: '1.1rem' }}
            />
          </div>
        </div>
      </div>

      <div>
        {searchTable === '' ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem', background: 'rgba(0, 0, 0, 0.02)', borderRadius: 'var(--radius-lg)' }}>
            <Utensils size={48} style={{ opacity: 0.2, margin: '0 auto 1rem auto' }} />
            <p>Please enter your table number above to view your active and past orders.</p>
          </div>
        ) : currentTableOrders.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {currentTableOrders.map(order => (
              <div key={order.id} className="glass-panel" style={{ padding: '1.5rem', background: 'var(--bg-card)', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>Order #{order.id.toString().slice(-4)}</span>
                  <span className={`badge badge-${order.status || 'pending'}`} style={{ fontSize: '1rem', padding: '0.4rem 1rem' }}>{order.status || 'pending'}</span>
                </div>
                <div style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: '1.6' }}>
                  {order.items?.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                </div>
                <div style={{ marginBottom: '1.5rem', fontWeight: 600, fontSize: '1.1rem' }}>
                  Total: ₹{order.total_amount || order.total}
                </div>
                <OrderProgressBar status={order.status} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem', background: 'rgba(0, 0, 0, 0.02)', borderRadius: 'var(--radius-lg)' }}>
            No active orders found for Table {searchTable}.
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTrackingView;
