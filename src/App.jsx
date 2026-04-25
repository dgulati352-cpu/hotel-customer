import React, { useState, useEffect } from 'react';
import { initialMenu } from './data';
import CustomerView from './components/CustomerView';
import OrderTrackingView from './components/OrderTrackingView';
import AdminView from './components/AdminView';
import LoginView from './components/LoginView';
import { Utensils, Moon, Sun, LogOut } from 'lucide-react';
import { db } from './firebase';
import { ref, push, set, onValue, update } from 'firebase/database';

function App() {
  const [user, setUser] = useState(null); // { role: 'customer' | 'admin', identifier: string }
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' or 'orders' or 'admin'
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [tableNumber, setTableNumber] = useState('');
  const [menu, setMenu] = useState(initialMenu);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    // Listen to live dishes from RTDB
    const dishesRef = ref(db, 'dishes');
    const unsubscribeMenu = onValue(dishesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const dishesData = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setMenu(dishesData);
      }
    });

    // Listen to live orders (so customer sees status updates)
    const ordersRef = ref(db, 'orders');
    const unsubscribeOrders = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        let dbOrders = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        // sort by timestamp desc
        dbOrders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setOrders(dbOrders);
      }
    });

    return () => {
      unsubscribeMenu();
      unsubscribeOrders();
    };
  }, []);

  const handlePlaceOrder = async (paymentDetails) => {
    if (cart.length === 0 || !tableNumber) return;

    try {
      const newOrderRef = push(ref(db, 'orders'));
      await set(newOrderRef, {
        table_number: tableNumber,
        items: cart.map(item => ({ name: item.name, price: item.price, quantity: item.quantity })),
        total_amount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: 'pending',
        payment_method: paymentDetails.method || "Online",
        timestamp: new Date().toISOString()
      });
      setCart([]);
      // keep the table number, they might want to order more
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Failed to place order.");
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const orderRef = ref(db, `orders/${orderId}`);
      await update(orderRef, { status: newStatus });
    } catch (e) {
      console.error("Error updating status: ", e);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]);
    setTableNumber('');
  };

  if (!user) {
    return (
      <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h1>
              <Utensils size={32} />
              FlavorFusion
            </h1>
          </div>
          <div className="tabs" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
              className="btn-outline" 
              style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', width: '40px', height: '40px' }}
              title="Toggle Theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        </header>
        <main style={{ flex: 1 }}>
          <LoginView onLogin={(userData) => {
            setUser(userData);
            if (userData.role === 'customer') {
              setTableNumber(userData.identifier);
              setActiveTab('menu');
            } else {
              setActiveTab('admin');
            }
          }} />
        </main>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h1>
            <Utensils size={32} />
            FlavorFusion
          </h1>
        </div>
        <div className="tabs" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user.role === 'customer' && (
            <>
              <button 
                className={`tab-btn ${activeTab === 'menu' ? 'active' : ''}`}
                onClick={() => setActiveTab('menu')}
              >
                Menu
              </button>
              <button 
                className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                Order Information
              </button>
            </>
          )}
          {user.role === 'admin' && (
            <button 
              className={`tab-btn ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveTab('admin')}
            >
              Admin Dashboard
            </button>
          )}
          <button 
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
            className="btn-outline" 
            style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', width: '40px', height: '40px' }}
            title="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button 
            onClick={handleLogout} 
            className="btn-outline" 
            style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', width: '40px', height: '40px', color: 'var(--accent-danger)', borderColor: 'var(--accent-danger)' }}
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main>
        {activeTab === 'menu' && (
          <CustomerView 
            menu={menu}
            cart={cart}
            setCart={setCart}
            tableNumber={tableNumber}
            setTableNumber={setTableNumber}
            onPlaceOrder={handlePlaceOrder}
            orders={orders}
          />
        )}
        {activeTab === 'orders' && (
          <OrderTrackingView orders={orders} />
        )}
        {activeTab === 'admin' && (
          <AdminView orders={orders} updateOrderStatus={updateOrderStatus} />
        )}
      </main>
    </div>
  );
}

export default App;
