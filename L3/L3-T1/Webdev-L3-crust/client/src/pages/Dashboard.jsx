import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { pizzaAPI } from '../services/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const { data } = await pizzaAPI.getAll();
        setPizzas(data);
      } catch (error) {
        toast.error('Failed to load pizzas');
      } finally {
        setLoading(false);
      }
    };
    fetchPizzas();
  }, []);

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Choose Your Pizza</h1>
        <p className="page-subtitle">Handcrafted with the finest ingredients</p>
      </div>

      <div className="dashboard-grid">
        {pizzas.map((pizza) => (
          <div key={pizza._id} className="pizza-card fade-in">
            <img
              src={pizza.image || 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400'}
              alt={pizza.name}
              className="pizza-image"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400'; }}
            />
            <div className="pizza-info">
              <h3 className="pizza-name">{pizza.name}</h3>
              <p className="pizza-description">{pizza.description}</p>
              <div className="pizza-footer">
                <span className="pizza-price">₹{pizza.price} <span>/pizza</span></span>
                <Link to="/build" className="btn btn-primary btn-sm">Customize</Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {pizzas.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">&#127829;</div>
          <h3 className="empty-title">No pizzas available</h3>
          <p>Check back later for our delicious menu!</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
