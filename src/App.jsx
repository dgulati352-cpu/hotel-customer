import React, { useState } from 'react';
import { initialMenu } from './data';
import CustomerView from './components/CustomerView';
import { Utensils } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('customer'); // 'customer' or 'admin'
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [tableNumber, setTableNumber] = useState('');

  const handlePlaceOrder = (paymentDetails) => {
    if (cart.length === 0 || !tableNumber) return;

    const newOrder = {
      id: Date.now(),
      tableNumber,
      items: [...cart],
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      status: 'accepted', // accepted -> preparing -> delivered
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      paymentDetails
    };

    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setTableNumber('');

    // Simulate order tracking
    setTimeout(() => {
      setOrders(currentOrders => currentOrders.map(order => 
        order.id === newOrder.id ? { ...order, status: 'preparing' } : order
      ));
    }, 5000); // 5 seconds to preparing

    setTimeout(() => {
      setOrders(currentOrders => currentOrders.map(order => 
        order.id === newOrder.id ? { ...order, status: 'delivered' } : order
      ));
    }, 12000); // 12 seconds to delivered
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  return (
    <div className="app-container">
      <header>
        <h1>
          <Utensils size={32} />
          FlavorFusion
        </h1>
      </header>

      <main>
        <CustomerView 
          menu={initialMenu}
          cart={cart}
          setCart={setCart}
          tableNumber={tableNumber}
          setTableNumber={setTableNumber}
          onPlaceOrder={handlePlaceOrder}
          orders={orders}
        />
      </main>
    </div>
  );
}

export default App;
