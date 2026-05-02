import React, { useState, useEffect } from 'react';
import { initialMenu } from './data';
import CustomerView from './components/CustomerView';
import OrderTrackingView from './components/OrderTrackingView';
import { Utensils, Moon, Sun, LogOut, LayoutGrid, ClipboardList } from 'lucide-react';
import { db } from './firebase';
import { ref, push, set, onValue, update } from 'firebase/database';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import LoginView from './components/LoginView';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' or 'orders'
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [tableNumber, setTableNumber] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('table') || '';
  });
  const [menu, setMenu] = useState(initialMenu);
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const dishesRef = ref(db, 'dishes');
    const unsubscribeMenu = onValue(dishesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const dishesData = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setMenu(dishesData);
      }
    });

    const ordersRef = ref(db, 'orders');
    const unsubscribeOrders = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        let dbOrders = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        dbOrders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setOrders(dbOrders);
      }
    });

    return () => {
      unsubscribeMenu();
      unsubscribeOrders();
    };
  }, []);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthInitialized(true);
    });
    return () => unsubscribeAuth();
  }, []);

  const handlePlaceOrder = async (paymentDetails) => {
    if (cart.length === 0 || !tableNumber) return;

    try {
      const newOrderRef = push(ref(db, 'orders'));
      await set(newOrderRef, {
        table_number: tableNumber,
        items: cart.map(item => ({ name: item.name, price: item.price, quantity: item.quantity, ...(item.portion ? { portion: item.portion } : {}) })),
        total_amount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: 'pending',
        payment_method: paymentDetails.method || "Online",
        timestamp: new Date().toISOString()
      });
      setCart([]);
      setActiveTab('orders');
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setTableNumber('');
      setCart([]);
    } catch (err) {
      console.error(err);
    }
  };

  if (!authInitialized) {
    return (
      <div className="app-container">
        <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          >
            <Utensils size={48} color="var(--accent-primary)" />
          </motion.div>
        </div>
      </div>
    );
  }

  if (!user || !tableNumber) {
    return (
      <div className="app-container">
        <header>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Utensils size={32} color="var(--accent-primary)" />
            <h1 style={{ margin: 0 }}>FlavorFusion</h1>
          </div>
          <button 
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
            className="btn-outline" 
            style={{ borderRadius: '50%', width: '45px', height: '45px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </header>
        <LoginView onLogin={(tNum, loggedUser) => {
          setTableNumber(tNum);
          setUser(loggedUser);
        }} />
      </div>
    );
  }

  return (
    <div className="app-container">
      <header>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Utensils size={32} color="var(--accent-primary)" />
          <h1 style={{ margin: 0 }}>FlavorFusion</h1>
        </div>
        
        <div className="tabs">
          <button 
            className={`tab-btn ${activeTab === 'menu' ? 'active' : ''}`}
            onClick={() => setActiveTab('menu')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LayoutGrid size={18} />
              <span>Menu</span>
            </div>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ClipboardList size={18} />
              <span>Orders</span>
            </div>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
            className="btn-outline" 
            style={{ borderRadius: '50%', width: '45px', height: '45px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button className="btn-outline" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LogOut size={18} />
            <span className="hide-mobile">Logout</span>
          </button>
        </div>
      </header>

      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
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
              <OrderTrackingView 
                orders={orders} 
                currentTableNumber={tableNumber} 
                onSwitchTab={setActiveTab}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}


export default App;
