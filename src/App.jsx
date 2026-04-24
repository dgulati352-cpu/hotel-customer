import React, { useState, useEffect } from 'react';
import { initialMenu } from './data';
import CustomerView from './components/CustomerView';
import OrderTrackingView from './components/OrderTrackingView';
import { Utensils } from 'lucide-react';
import { db } from './firebase';
import { ref, push, set, onValue } from 'firebase/database';

function App() {
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' or 'orders'
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [tableNumber, setTableNumber] = useState('');
  const [menu, setMenu] = useState(initialMenu);

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
      setTableNumber('');
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Failed to place order.");
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    // Readonly on customer side now, handled by admin
  };

  return (
    <div className="app-container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h1>
            <Utensils size={32} />
            FlavorFusion
          </h1>
        </div>
        <div className="tabs" style={{ margin: 0 }}>
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
        </div>
      </header>

      <main>
        {activeTab === 'menu' ? (
          <CustomerView 
            menu={menu}
            cart={cart}
            setCart={setCart}
            tableNumber={tableNumber}
            setTableNumber={setTableNumber}
            onPlaceOrder={handlePlaceOrder}
            orders={orders}
          />
        ) : (
          <OrderTrackingView orders={orders} />
        )}
      </main>
    </div>
  );
}

export default App;
