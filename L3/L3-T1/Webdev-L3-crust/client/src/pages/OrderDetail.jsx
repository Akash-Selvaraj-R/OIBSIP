import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const statusSteps = ['Order Received', 'In Kitchen', 'Sent to Delivery'];

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await orderAPI.getOne(id);
        setOrder(data);
      } catch (error) {
        toast.error('Failed to load order');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();

    const socket = io(window.location.origin, { path: '/socket.io' });
    socket.on('orderStatusUpdate', (update) => {
      if (update.orderId === id) {
        setOrder(prev => prev ? { ...prev, status: update.status, updatedAt: update.updatedAt } : prev);
        toast.success(`Status updated: ${update.status}`);
      }
    });

    return () => socket.disconnect();
  }, [id]);

  const getStepStatus = (stepIndex) => {
    if (!order) return '';
    const currentIndex = statusSteps.indexOf(order.status);
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return '';
  };

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  if (!order) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <h3 className="empty-title">Order not found</h3>
          <Link to="/orders" className="btn btn-primary" style={{ marginTop: '1rem' }}>Back to Orders</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="builder-container">
        <Link to="/orders" style={{ color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '1rem', display: 'inline-block' }}>
          ← Back to Orders
        </Link>

        <div className="page-header">
          <h1 className="page-title">Order #{order._id.slice(-8).toUpperCase()}</h1>
          <p className="page-subtitle">{new Date(order.createdAt).toLocaleString()}</p>
        </div>

        <div className="status-tracker fade-in">
          {statusSteps.map((step, i) => (
            <div key={step} className={`status-tracker-step ${getStepStatus(i)}`}>
              <div className="tracker-dot">
                {getStepStatus(i) === 'completed' ? '✓' : i + 1}
              </div>
              <span className="tracker-label">{step}</span>
            </div>
          ))}
        </div>

        <div className="summary-card fade-in" style={{ marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Order Details</h3>

          {order.customPizza && (
            <>
              <div className="summary-row">
                <span className="summary-label">Base</span>
                <span className="summary-value">{order.customPizza.base}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Sauce</span>
                <span className="summary-value">{order.customPizza.sauce}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Cheese</span>
                <span className="summary-value">{order.customPizza.cheese}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Vegetables</span>
                <span className="summary-value">{order.customPizza.vegetables?.join(', ')}</span>
              </div>
            </>
          )}

          <div className="summary-row">
            <span className="summary-label">Payment</span>
            <span className="summary-value" style={{ color: order.paymentStatus === 'completed' ? 'var(--success)' : 'var(--warning)' }}>
              {order.paymentStatus === 'completed' ? 'Paid' : 'Pending'}
            </span>
          </div>

          {order.deliveryAddress && (
            <div className="summary-row">
              <span className="summary-label">Delivery Address</span>
              <span className="summary-value">{order.deliveryAddress}</span>
            </div>
          )}

          <div className="summary-total">
            <span>Total Paid</span>
            <span className="total-price">₹{order.amount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
