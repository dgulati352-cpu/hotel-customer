import React, { useState, useMemo } from 'react';
import { Search, ClipboardCheck, Clock, ChefHat, CheckCircle2, History, Plus, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const getStatusProgress = (status) => {
  const s = (status || '').toLowerCase();
  if (s === 'delivered' || s === 'completed' || s === 'picked up' || s === 'ready') return 3;
  if (s === 'preparing' || s === 'prepared') return 2;
  return 1; // accepted / pending
};

const OrderProgressBar = ({ status }) => {
  const step = getStatusProgress(status);
  const percentage = step === 1 ? 33 : step === 2 ? 66 : 100;
  
  const steps = [
    { label: "Accepted", icon: Clock },
    { label: "Preparing", icon: ChefHat },
    { label: "Ready", icon: CheckCircle2 }
  ];

  return (
    <div style={{ marginTop: '1.25rem' }}>
      <div className="progressive-bar-container" style={{ height: '8px' }}>
        <motion.div 
          className="progressive-bar-fill" 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ background: step === 3 ? 'var(--accent-success)' : 'var(--accent-primary)' }}
        />
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', marginTop: '0.75rem' }}>
        {steps.map((s, i) => {
          const isActive = step >= (i + 1);
          const Icon = s.icon;
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: i === 0 ? 'flex-start' : i === 2 ? 'flex-end' : 'center', textAlign: 'center', gap: '0.4rem' }}>
              <div style={{ 
                width: '24px', 
                height: '24px', 
                borderRadius: '50%', 
                background: isActive ? (i === 2 && step === 3 ? 'var(--accent-success)' : 'var(--accent-primary)') : 'var(--bg-input)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isActive ? 'white' : 'var(--text-muted)',
                transition: 'all 0.3s ease'
              }}>
                <Icon size={12} />
              </div>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: isActive ? 'var(--text-main)' : 'var(--text-muted)', textTransform: 'uppercase' }}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const OrderTrackingView = ({ orders, currentTableNumber, onSwitchTab }) => {
  const [searchTable, setSearchTable] = useState(currentTableNumber || '');
  
  const { activeOrders, pastOrders } = useMemo(() => {
    const tableOrders = orders.filter(o => String(o.table_number || o.tableNumber) === String(searchTable));
    return {
      activeOrders: tableOrders.filter(o => !['delivered', 'completed', 'ready'].includes((o.status || '').toLowerCase())),
      pastOrders: tableOrders.filter(o => ['delivered', 'completed', 'ready'].includes((o.status || '').toLowerCase()))
    };
  }, [orders, searchTable]);

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ marginBottom: '1rem', display: 'inline-flex', padding: '1rem', background: 'var(--accent-primary-glow)', borderRadius: 'var(--radius-xl)' }}
        >
          <ClipboardCheck size={40} color="var(--accent-primary)" />
        </motion.div>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.04em' }}>Your Order Journey</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Tracking orders for Table {searchTable || '??'}</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
        <div className="search-bar" style={{ flex: 1 }}>
          <Search size={20} className="search-icon" />
          <input 
            type="number" 
            placeholder="Change Table No..." 
            value={searchTable}
            onChange={(e) => setSearchTable(e.target.value)}
            style={{ height: '54px', borderRadius: 'var(--radius-lg)' }}
          />
        </div>
        <button 
          className="btn-primary" 
          onClick={() => onSwitchTab('menu')}
          style={{ whiteSpace: 'nowrap' }}
        >
          <Plus size={20} /> <span className="hide-mobile">Order More</span>
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        {/* Active Orders Section */}
        <section>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 800 }}>
            <Clock size={22} color="var(--accent-primary)" /> Active Orders
          </h3>
          <AnimatePresence mode="popLayout">
            {activeOrders.length === 0 ? (
              <motion.div 
                key="no-active"
                className="glass-panel"
                style={{ padding: '3rem', textAlign: 'center', opacity: 0.7 }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              >
                <p style={{ fontWeight: 600 }}>No active orders at the moment</p>
                <button 
                  className="btn-outline" 
                  style={{ marginTop: '1rem' }}
                  onClick={() => onSwitchTab('menu')}
                >
                  Explore Menu
                </button>
              </motion.div>
            ) : (
              activeOrders.map((order, index) => (
                <motion.div 
                  key={order.id} 
                  className="glass-panel" 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{ padding: '2rem', marginBottom: '1.5rem', borderLeft: '6px solid var(--accent-primary)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Order #{order.id.toString().slice(-4)}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(order.timestamp).toLocaleTimeString()}</p>
                    </div>
                    <span className={`badge badge-${order.status || 'pending'}`}>{order.status || 'pending'}</span>
                  </div>
                  
                  <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {order.items?.map((i, idx) => (
                        <span key={idx} style={{ fontSize: '0.85rem', fontWeight: 600 }}>{i.quantity}x {i.name}</span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total</span>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>₹{order.total_amount || order.total}</div>
                    </div>
                    <div style={{ flex: 0.7 }}>
                      <OrderProgressBar status={order.status} />
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </section>

        {/* Past Orders Section */}
        {pastOrders.length > 0 && (
          <section>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 800 }}>
              <History size={22} color="var(--text-muted)" /> Order History
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {pastOrders.map((order, index) => (
                <motion.div 
                  key={order.id} 
                  className="glass-panel" 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ padding: '1.5rem', opacity: 0.8 }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>#{order.id.toString().slice(-4)}</span>
                    <span className="badge badge-ready" style={{ fontSize: '0.65rem' }}>Completed</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    {order.items?.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem' }}>{new Date(order.timestamp).toLocaleDateString()}</span>
                    <span style={{ fontWeight: 800 }}>₹{order.total_amount || order.total}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default OrderTrackingView;
