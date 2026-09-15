import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await orderAPI.getAll();
        setOrders(data);
      } catch (error) {
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();

    const socket = io(window.location.origin, { path: '/socket.io' });
    socket.on('orderStatusUpdate', (update) => {
      setOrders(prev => prev.map(order =>
        order._id === update.orderId
          ? { ...order, status: update.status, updatedAt: update.updatedAt }
          : order
      ));
      toast.success(`Order status updated: ${update.status}`);
    });

    return () => socket.disconnect();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case 'Order Received': return 'status-received';
      case 'In Kitchen': return 'status-kitchen';
      case 'Sent to Delivery': return 'status-delivery';
      default: return 'status-received';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <div className="loading-text">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="brand-stamp black" style={{ marginBottom: '1rem' }}>REAL-TIME</div>
        <h1 className="page-title">YOUR<br />ORDERS</h1>
        <p className="page-subtitle">Track your pizza orders in real-time</p>
      </div>

      <div className="orders-list">
        {orders.map((order) => (
          <Link to={`/orders/${order._id}`} key={order._id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="order-card fade-in">
              <div className="order-header">
                <div>
                  <span className="order-id">#{order._id.slice(-8).toUpperCase()}</span>
                  <p className="order-date">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <span className={`order-status ${getStatusClass(order.status)}`}>
                  {order.status}
                </span>
              </div>

              <div className="order-items">
                {order.customPizza ? (
                  <span>Custom: {order.customPizza.base} | {order.customPizza.sauce} | {order.customPizza.cheese} | {order.customPizza.vegetables?.join(', ')}</span>
                ) : (
                  <span>{order.items?.map(i => i.name).join(', ')}</span>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="order-amount">₹{order.amount}</span>
                <span className={`brand-stamp ${order.paymentStatus === 'completed' ? 'green' : 'yellow'}`}>
                  {order.paymentStatus === 'completed' ? 'PAID' : 'PENDING'}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3 className="empty-title">NO ORDERS YET</h3>
          <p>Nothing to bake yet.</p>
          <Link to="/build" className="btn btn-primary" style={{ marginTop: '1rem' }}>BUILD A PIZZA →</Link>
        </div>
      )}
    </div>
  );
};

export default Orders;
