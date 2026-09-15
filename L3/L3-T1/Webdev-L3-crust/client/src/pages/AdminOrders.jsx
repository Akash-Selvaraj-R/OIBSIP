import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const { data } = await adminAPI.getOrders();
      setOrders(data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await adminAPI.updateOrderStatus(orderId, { status: newStatus });
      toast.success('Status updated');
      fetchOrders();
      if (selectedOrder?._id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getNextStatus = (current) => {
    const flow = ['Order Received', 'In Kitchen', 'Sent to Delivery'];
    const idx = flow.indexOf(current);
    return idx < flow.length - 1 ? flow[idx + 1] : null;
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Order Received': return 'status-received';
      case 'In Kitchen': return 'status-kitchen';
      case 'Sent to Delivery': return 'status-delivery';
      default: return 'status-received';
    }
  };

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div style={{ marginBottom: '2rem' }}>
          <h2 className="logo" style={{ fontSize: '1.5rem' }}>CRUST<span>.</span></h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Admin Panel</p>
        </div>

        <nav className="sidebar-nav">
          <Link to="/admin" className={`sidebar-link ${location.pathname === '/admin' ? 'active' : ''}`}>
            <span>&#128200;</span> Overview
          </Link>
          <Link to="/admin/inventory" className={`sidebar-link ${location.pathname === '/admin/inventory' ? 'active' : ''}`}>
            <span>&#128230;</span> Inventory
          </Link>
          <Link to="/admin/orders" className={`sidebar-link ${location.pathname === '/admin/orders' ? 'active' : ''}`}>
            <span>&#128196;</span> Orders
          </Link>
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <button onClick={() => { logout(); navigate('/admin/login'); }} className="sidebar-link" style={{ width: '100%' }}>
            <span>&#128682;</span> Logout
          </button>
        </div>
      </aside>

      <main className="admin-content">
        <div className="page-header">
          <h1 className="page-title">Order Management</h1>
          <p className="page-subtitle">Manage and update order statuses</p>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td><span className="order-id">#{order._id.slice(-8).toUpperCase()}</span></td>
                  <td>
                    <div>{order.user?.name || 'N/A'}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.user?.email}</div>
                  </td>
                  <td style={{ maxWidth: '200px' }}>
                    {order.customPizza ? (
                      <span style={{ fontSize: '0.85rem' }}>
                        {order.customPizza.base} | {order.customPizza.sauce} | {order.customPizza.cheese}
                        {order.customPizza.vegetables?.length > 0 && ` | ${order.customPizza.vegetables.join(', ')}`}
                      </span>
                    ) : (
                      <span>{order.items?.map(i => i.name).join(', ')}</span>
                    )}
                  </td>
                  <td style={{ fontWeight: 700 }}>₹{order.amount}</td>
                  <td>
                    <span style={{ color: order.paymentStatus === 'completed' ? 'var(--success)' : 'var(--warning)', fontSize: '0.85rem', fontWeight: 600 }}>
                      {order.paymentStatus === 'completed' ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                  <td>
                    <span className={`order-status ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        View
                      </button>
                      {getNextStatus(order.status) && (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleStatusUpdate(order._id, getNextStatus(order.status))}
                        >
                          → {getNextStatus(order.status)}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">&#128196;</div>
            <h3 className="empty-title">No orders yet</h3>
            <p>Orders will appear here when customers place them</p>
          </div>
        )}

        {selectedOrder && (
          <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Order #{selectedOrder._id.slice(-8).toUpperCase()}</h3>
                <button className="modal-close" onClick={() => setSelectedOrder(null)}>&times;</button>
              </div>
              <div className="modal-body">
                <div className="summary-row">
                  <span className="summary-label">Customer</span>
                  <span className="summary-value">{selectedOrder.user?.name}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Email</span>
                  <span className="summary-value">{selectedOrder.user?.email}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Phone</span>
                  <span className="summary-value">{selectedOrder.phone || 'N/A'}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Address</span>
                  <span className="summary-value">{selectedOrder.deliveryAddress || 'N/A'}</span>
                </div>

                {selectedOrder.customPizza && (
                  <>
                    <h4 style={{ margin: '1rem 0 0.5rem', color: 'var(--text-secondary)' }}>Custom Pizza</h4>
                    <div className="summary-row">
                      <span className="summary-label">Base</span>
                      <span className="summary-value">{selectedOrder.customPizza.base}</span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-label">Sauce</span>
                      <span className="summary-value">{selectedOrder.customPizza.sauce}</span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-label">Cheese</span>
                      <span className="summary-value">{selectedOrder.customPizza.cheese}</span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-label">Vegetables</span>
                      <span className="summary-value">{selectedOrder.customPizza.vegetables?.join(', ')}</span>
                    </div>
                  </>
                )}

                <div className="summary-row" style={{ marginTop: '1rem' }}>
                  <span className="summary-label">Amount</span>
                  <span className="summary-value" style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--primary)' }}>₹{selectedOrder.amount}</span>
                </div>

                <div className="summary-row">
                  <span className="summary-label">Payment</span>
                  <span className="summary-value" style={{ color: selectedOrder.paymentStatus === 'completed' ? 'var(--success)' : 'var(--warning)' }}>
                    {selectedOrder.paymentStatus === 'completed' ? 'Paid' : 'Pending'}
                  </span>
                </div>

                {selectedOrder.razorpayPaymentId && (
                  <div className="summary-row">
                    <span className="summary-label">Payment ID</span>
                    <span className="summary-value" style={{ fontSize: '0.85rem' }}>{selectedOrder.razorpayPaymentId}</span>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                {getNextStatus(selectedOrder.status) && (
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      handleStatusUpdate(selectedOrder._id, getNextStatus(selectedOrder.status));
                      setSelectedOrder(prev => ({ ...prev, status: getNextStatus(prev.status) }));
                    }}
                  >
                    Mark as "{getNextStatus(selectedOrder.status)}"
                  </button>
                )}
                <button className="btn btn-outline" onClick={() => setSelectedOrder(null)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminOrders;
