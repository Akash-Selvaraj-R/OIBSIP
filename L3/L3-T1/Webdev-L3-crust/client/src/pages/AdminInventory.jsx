import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { inventoryAPI } from '../services/api';
import toast from 'react-hot-toast';

const AdminInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState(0);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const fetchInventory = async () => {
    try {
      const { data } = await inventoryAPI.getAll();
      setInventory(data);
    } catch (error) {
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleStockUpdate = async (id, newStock) => {
    try {
      await inventoryAPI.update(id, { stock: Math.max(0, newStock) });
      toast.success('Stock updated');
      fetchInventory();
      setEditingId(null);
    } catch (error) {
      toast.error('Failed to update stock');
    }
  };

  const getStockBadge = (stock, threshold) => {
    if (stock <= threshold * 0.5) return 'stock-low';
    if (stock <= threshold) return 'stock-medium';
    return 'stock-high';
  };

  const filteredInventory = filter === 'all' ? inventory : inventory.filter(i => i.category === filter);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <div className="loading-text">Loading inventory...</div>
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
          <div className="brand-stamp yellow" style={{ marginBottom: '1rem' }}>KITCHEN CONTROL</div>
          <h1 className="page-title">INVENTORY</h1>
          <p className="page-subtitle">Manage your stock levels</p>
        </div>

        <div className="tabs">
          {['all', 'base', 'sauce', 'cheese', 'vegetable'].map((cat) => (
            <button
              key={cat}
              className={`tab ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat === 'all' ? 'ALL' : cat.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Threshold</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item) => (
                <tr key={item._id}>
                  <td style={{ fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em' }}>{item.name}</td>
                  <td style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{item.category}</td>
                  <td>
                    {editingId === item._id ? (
                      <div className="stock-controls">
                        <button className="stock-btn" onClick={() => setEditValue(Math.max(0, editValue - 1))}>-</button>
                        <input
                          type="number"
                          className="form-input"
                          style={{ width: '80px', textAlign: 'center', padding: '0.4rem' }}
                          value={editValue}
                          onChange={(e) => setEditValue(parseInt(e.target.value) || 0)}
                          min={0}
                        />
                        <button className="stock-btn" onClick={() => setEditValue(editValue + 1)}>+</button>
                        <button className="btn btn-success btn-sm" onClick={() => handleStockUpdate(item._id, editValue)}>SAVE</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => setEditingId(null)} style={{ color: 'var(--text-secondary)' }}>CANCEL</button>
                      </div>
                    ) : (
                      <span
                        className="stock-badge"
                        style={{ cursor: 'pointer' }}
                        onClick={() => { setEditingId(item._id); setEditValue(item.stock); }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter') { setEditingId(item._id); setEditValue(item.stock); } }}
                      >
                        {item.stock}
                      </span>
                    )}
                  </td>
                  <td>{item.threshold}</td>
                  <td>
                    <span className={`stock-badge ${getStockBadge(item.stock, item.threshold)}`}>
                      {item.stock <= item.threshold * 0.5 ? 'CRITICAL' : item.stock <= item.threshold ? 'LOW' : 'OK'}
                    </span>
                  </td>
                  <td>
                    <div className="stock-controls">
                      <button
                        className="stock-btn"
                        onClick={() => handleStockUpdate(item._id, item.stock - 1)}
                        disabled={item.stock <= 0}
                      >-</button>
                      <button
                        className="stock-btn"
                        onClick={() => handleStockUpdate(item._id, item.stock + 1)}
                      >+</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredInventory.length === 0 && (
          <div className="empty-state">
            <h3 className="empty-title">NO INVENTORY ITEMS</h3>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminInventory;
