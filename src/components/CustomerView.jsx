import React, { useState, useMemo } from 'react';
import { Search, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import PaymentModal from './PaymentModal';
import CustomDropdown from './CustomDropdown';

const CustomerView = ({ menu, cart, setCart, tableNumber, setTableNumber, onPlaceOrder, orders }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'veg', 'non-veg'
  const [sortPrice, setSortPrice] = useState('none'); // 'none', 'low-high', 'high-low'
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [tableError, setTableError] = useState(false);

  const filteredAndSortedMenu = useMemo(() => {
    let result = [...menu];

    // Search
    if (searchTerm) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter Veg/Non-veg
    if (filterType !== 'all') {
      result = result.filter(item => item.type === filterType);
    }

    // Sort Price
    if (sortPrice === 'low-high') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortPrice === 'high-low') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [menu, searchTerm, filterType, sortPrice]);

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    if (!tableNumber) {
      setTableError(true);
      setTimeout(() => setTableError(false), 2000);
      return;
    }
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (paymentDetails) => {
    setIsPaymentModalOpen(false);
    onPlaceOrder(paymentDetails);
  };

  // Find all orders for the current table to show history
  const currentTableOrders = orders.filter(o => String(o.table_number || o.tableNumber) === String(tableNumber));

  return (
    <div className="main-grid">
      <div className="menu-section">
        <div className="filters glass-panel" style={{ padding: '1rem' }}>
          <div className="search-bar">
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              placeholder="Search dishes..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <CustomDropdown 
            value={filterType} 
            onChange={setFilterType} 
            options={[
              { value: 'all', label: 'All Types' },
              { value: 'veg', label: 'Veg Only' },
              { value: 'non-veg', label: 'Non-Veg Only' }
            ]} 
          />

          <CustomDropdown 
            value={sortPrice} 
            onChange={setSortPrice} 
            options={[
              { value: 'none', label: 'Sort by Price' },
              { value: 'low-high', label: 'Low to High' },
              { value: 'high-low', label: 'High to Low' }
            ]} 
          />
        </div>

        <div className="menu-grid">
          {filteredAndSortedMenu.map(item => (
            <div key={item.id} className="menu-card glass-panel">
              <img src={item.image} alt={item.name} className="menu-img" />
              <div className="menu-info">
                <div className="menu-meta">
                  <span className={`badge badge-${item.type}`}>{item.type}</span>
                  <span className="menu-price">₹{item.price}</span>
                </div>
                <h3 className="menu-title">{item.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{item.category}</p>
                <button className="btn-primary" style={{ marginTop: 'auto' }} onClick={() => addToCart(item)}>
                  <Plus size={16} /> Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-panel glass-panel">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingCart size={24} /> 
            Your Order
          </h2>

          <div className="form-group">
            <label style={{ color: tableError ? 'var(--accent-danger)' : 'var(--text-muted)' }}>
              {tableError ? 'Table Number is required!' : 'Table Number'}
            </label>
            <input 
              type="number" 
              placeholder="Enter your table number (e.g. 5)" 
              value={tableNumber}
              onChange={(e) => {
                setTableNumber(e.target.value);
                setTableError(false);
              }}
              className={tableError ? 'input-error' : ''}
              style={tableError ? { borderColor: 'var(--accent-danger)', animation: 'shake 0.4s' } : {}}
            />
          </div>

          {currentTableOrders.length > 0 && (
            <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.05)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(59, 130, 246, 0.2)', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem' }}>Order History</h3>
              {currentTableOrders.map(order => (
                <div key={order.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Order #{order.id.toString().slice(-4)}</span>
                    <span className={`badge badge-${order.status || 'pending'}`}>{order.status || 'pending'}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {order.items?.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="cart-items" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {cart.length === 0 ? (
              <div className="empty-state">
                <ShoppingCart size={48} opacity={0.2} />
                <p>Your cart is empty</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="cart-item">
                  <div>
                    <div style={{ fontWeight: 500 }}>{item.name}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>₹{item.price} x {item.quantity}</div>
                  </div>
                  <div className="cart-item-controls">
                    <button className="cart-item-btn" onClick={() => updateQuantity(item.id, -1)}><Minus size={14} /></button>
                    <span>{item.quantity}</span>
                    <button className="cart-item-btn" onClick={() => updateQuantity(item.id, 1)}><Plus size={14} /></button>
                    <button className="cart-item-btn" style={{ color: 'var(--accent-danger)', marginLeft: '0.5rem' }} onClick={() => removeFromCart(item.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <>
              <div className="cart-total">
                <span>Total</span>
                <span>₹{cartTotal}</span>
              </div>
              <button 
                className="btn-success" 
                style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', fontWeight: 600, borderRadius: 'var(--radius-md)' }}
                onClick={handleCheckout}
              >
                Proceed to Pay
              </button>
            </>
          )}
        </div>
      </div>

      {isPaymentModalOpen && (
        <PaymentModal 
          total={cartTotal} 
          onClose={() => setIsPaymentModalOpen(false)} 
          onSuccess={handlePaymentSuccess} 
        />
      )}
    </div>
  );
};

export default CustomerView;
