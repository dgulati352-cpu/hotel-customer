import React, { useState } from 'react';
import { Clock, CheckCircle, Package, Settings, Utensils, Pencil, Trash2, PlusCircle, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminView = ({ orders, updateOrderStatus, menu, onUpdateDish, onDeleteDish, onAddDish }) => {
  const [adminTab, setAdminTab] = useState('kitchen');
  const [editingDish, setEditingDish] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    image: '',
    type: 'veg'
  });

  const handleEditClick = (dish) => {
    setEditingDish(dish);
    setFormData({
      name: dish.name || '',
      category: dish.category || '',
      price: dish.price || '',
      image: dish.image || '',
      type: dish.type || 'veg'
    });
    setShowForm(true);
  };

  const handleAddClick = () => {
    setEditingDish(null);
    setFormData({
      name: '',
      category: '',
      price: '',
      image: '',
      type: 'veg'
    });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      price: Number(formData.price)
    };
    if (editingDish) {
      onUpdateDish(editingDish.id, data);
    } else {
      onAddDish(data);
    }
    setShowForm(false);
  };

  if (adminTab === 'kitchen') {
    return (
      <div style={{ marginTop: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Kitchen Orders</h2>
          <button className="btn-outline" onClick={() => setAdminTab('menu')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Settings size={18} /> Menu Manager
          </button>
        </div>

        {!orders || orders.length === 0 ? (
          <div className="empty-state glass-panel">
            <Package size={64} opacity={0.2} />
            <h2>No Active Orders</h2>
            <p>Waiting for customers to place orders...</p>
          </div>
        ) : (
          <div className="orders-grid">
            {orders.map(order => (
              <KitchenOrderCard key={order.id} order={order} updateOrderStatus={updateOrderStatus} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ marginTop: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Menu Management</h2>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-primary" onClick={handleAddClick} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PlusCircle size={18} /> Add Dish
          </button>
          <button className="btn-outline" onClick={() => setAdminTab('kitchen')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Utensils size={18} /> Kitchen View
          </button>
        </div>
      </div>

      <div className="glass-panel" style={{ overflowX: 'auto', padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
          <thead style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
            <tr>
              <th style={{ padding: '1rem' }}>Dish</th>
              <th style={{ padding: '1rem' }}>Category</th>
              <th style={{ padding: '1rem' }}>Price</th>
              <th style={{ padding: '1rem' }}>Type</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {menu.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                  <span style={{ fontWeight: 600 }}>{item.name}</span>
                </td>
                <td style={{ padding: '1rem' }}>{item.category}</td>
                <td style={{ padding: '1rem', fontWeight: 700 }}>₹{item.price}</td>
                <td style={{ padding: '1rem' }}>
                  <span className={`badge badge-${item.type}`}>{item.type}</span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button className="btn-outline" style={{ padding: '8px' }} onClick={() => handleEditClick(item)}>
                      <Pencil size={16} />
                    </button>
                    <button className="btn-outline" style={{ padding: '8px', color: 'var(--accent-danger)' }} onClick={() => onDeleteDish(item.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="taste-profiler-overlay glass-panel" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)' }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-panel"
              style={{ width: 'min(90%, 500px)', padding: '2rem', position: 'relative' }}
            >
              <button onClick={() => setShowForm(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
              
              <h2 style={{ marginBottom: '1.5rem' }}>{editingDish ? 'Modify Dish' : 'Add New Dish'}</h2>
              
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group">
                  <label>Dish Name</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Butter Paneer" />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <input required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="e.g. Main Course" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Price (₹)</label>
                    <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="250" />
                  </div>
                  <div className="form-group">
                    <label>Type</label>
                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={{ padding: '0.85rem', borderRadius: '12px', background: 'var(--bg-input)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}>
                      <option value="veg">Veg</option>
                      <option value="non-veg">Non-Veg</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input required value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="https://images.unsplash.com/..." />
                </div>
                
                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <Save size={18} /> {editingDish ? 'Update Dish' : 'Save Dish'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const KitchenOrderCard = ({ order, updateOrderStatus }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'var(--accent-primary)';
      case 'preparing': return 'var(--accent-warning)';
      case 'prepared': return 'var(--accent-success)';
      case 'delivered': return 'var(--text-muted)';
      default: return 'var(--text-muted)';
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return timestamp;
    }
  };

  return (
    <div className="order-card glass-panel" style={{ borderTop: `4px solid ${getStatusColor(order.status)}` }}>
      <div className="order-header">
        <div>
          <h3 style={{ fontSize: '1.25rem' }}>Table {order.table_number || order.tableNumber || 'N/A'}</h3>
          {order.userName && (
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-primary)', marginTop: '0.1rem' }}>
              {order.userName}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            <Clock size={14} /> {formatTime(order.timestamp || order.time)} | #{order.id?.toString().slice(-4)}
          </div>
        </div>
        <span className={`badge badge-${order.status || 'pending'}`}>{order.status || 'pending'}</span>
      </div>
      
      <div className="order-items">
        {(order.items || []).map((item, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{item.quantity}x {item.name}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 600 }}>Total: ₹{order.total_amount || order.total || 0}</span>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{order.payment_method || order.paymentDetails?.method || 'Paid Online'}</span>
      </div>

      <div className="order-actions">
        {(order.status === 'pending' || order.status === 'accepted') && (
          <button className="btn-primary" style={{ flex: 1, padding: '0.5rem' }} onClick={() => updateOrderStatus(order.id, 'preparing')}>
            Start Preparing
          </button>
        )}
        {order.status === 'preparing' && (
          <button className="btn-success" style={{ flex: 1, padding: '0.5rem' }} onClick={() => updateOrderStatus(order.id, 'prepared')}>
            <CheckCircle size={16} /> Mark Prepared
          </button>
        )}
        {order.status === 'prepared' && (
          <button className="btn-outline" style={{ flex: 1, padding: '0.5rem' }} onClick={() => updateOrderStatus(order.id, 'delivered')}>
            Mark Delivered
          </button>
        )}
        {order.status === 'delivered' && (
          <div style={{ flex: 1, textAlign: 'center', padding: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
            Order completed
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminView;
