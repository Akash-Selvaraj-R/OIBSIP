import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          adminAPI.getDashboard(),
          adminAPI.getOrders()
        ]);
        setStats(statsRes.data);
        setOrders(ordersRes.data.slice(0, 10));
      } catch (error) {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    const socket = io(window.location.origin, { path: '/socket.io' });
    socket.on('orderStatusUpdate', () => fetchData());

    return () => socket.disconnect();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await adminAPI.updateOrderStatus(orderId, { status: newStatus });
      toast.success('Status updated');
      const { data } = await adminAPI.getOrders();
      setOrders(data.slice(0, 10));
      const { data: statsData } = await adminAPI.getDashboard();
      setStats(statsData);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getNextStatus = (current) => {
    const flow = ['Order Received', 'In Kitchen', 'Sent to Delivery'];
    const idx = flow.indexOf(current);
    return idx < flow.length - 1 ? flow[idx + 1] : null;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <div className="loading-text">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div style={{ marginBottom: '2rem' }}>
          <h2 className="logo" style={{ fontSize: '1.5rem' }}>CRUST<span>.</span></h2>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', marginTop: '0.25rem', fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Admin Panel
          </p>
        </div>

        <nav className="sidebar-nav">
          <Link to="/admin" className={`sidebar-link ${location.pathname === '/admin' ? 'active' : ''}`}>
            <span>↗</span> Overview
          </Link>
          <Link to="/admin/inventory" className={`sidebar-link ${location.pathname === '/admin/inventory' ? 'active' : ''}`}>
            <span>☰</span> Inventory
          </Link>
          <Link to="/admin/orders" className={`sidebar-link ${location.pathname === '/admin/orders' ? 'active' : ''}`}>
            <span>≡</span> Orders
          </Link>
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <button onClick={() => { logout(); navigate('/admin/login'); }} className="sidebar-link" style={{ width: '100%' }}>
            <span>↪</span> Logout
          </button>
        </div>
      </aside>

      <main className="admin-content">
        <div className="page-header">
          <div className="brand-stamp red" style={{ marginBottom: '1rem' }}>DASHBOARD</div>
          <h1 className="page-title">OVERVIEW</h1>
          <p className="page-subtitle">Welcome back, {user?.name}</p>
        </div>

        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Total Orders</div>
              <div className="stat-value primary">{stats.totalOrders}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Order Received</div>
              <div className="stat-value info">{stats.ordersReceived}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">In Kitchen</div>
              <div className="stat-value warning">{stats.inKitchen}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Sent to Delivery</div>
              <div className="stat-value success">{stats.sentToDelivery}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Users</div>
              <div className="stat-value">{stats.totalUsers}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Low Stock Items</div>
              <div className="stat-value danger">{stats.lowStockItems}</div>
            </div>
          </div>
        )}

        <div className="table-container">
          <div className="table-header">
            <span className="table-title">RECENT ORDERS</span>
            <Link to="/admin/orders" className="btn btn-ghost btn-sm" style={{ color: 'var(--text-secondary)' }}>VIEW ALL →</Link>
          </div>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td><span className="order-id">#{order._id.slice(-8).toUpperCase()}</span></td>
                  <td>{order.user?.name || 'N/A'}</td>
                  <td style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>₹{order.amount}</td>
                  <td>
                    <span className={`order-status status-${order.status === 'Order Received' ? 'received' : order.status === 'In Kitchen' ? 'kitchen' : 'delivery'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    {getNextStatus(order.status) && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleStatusUpdate(order._id, getNextStatus(order.status))}
                      >
                        → {getNextStatus(order.status)}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="empty-state">
              <p>No orders yet</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
