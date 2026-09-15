import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePizza } from '../context/PizzaContext';
import { inventoryAPI } from '../services/api';
import toast from 'react-hot-toast';

const STEPS = ['Base', 'Sauce', 'Cheese', 'Veggies', 'Summary'];

const Builder = () => {
  const { builder, updateBuilder, toggleVegetable } = usePizza();
  const [inventory, setInventory] = useState({ base: [], sauce: [], cheese: [], vegetable: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const categories = ['base', 'sauce', 'cheese', 'vegetable'];
        const results = await Promise.all(categories.map(c => inventoryAPI.getAll(c)));
        const inv = {};
        categories.forEach((c, i) => { inv[c] = results[i].data; });
        setInventory(inv);
      } catch (error) {
        toast.error('Failed to load options');
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  const getStepPrice = () => {
    let price = 0;
    if (builder.base) price += builder.base.price;
    if (builder.sauce) price += builder.sauce.price;
    if (builder.cheese) price += builder.cheese.price;
    builder.vegetables.forEach(vegName => {
      const veg = inventory.vegetable.find(v => v.name === vegName);
      if (veg) price += veg.price;
    });
    return price;
  };

  const canProceed = () => {
    switch (builder.step) {
      case 1: return builder.base !== null;
      case 2: return builder.sauce !== null;
      case 3: return builder.cheese !== null;
      case 4: return builder.vegetables.length > 0;
      default: return false;
    }
  };

  const nextStep = () => {
    if (!canProceed()) {
      toast.error('Please make a selection');
      return;
    }
    if (builder.step < 5) {
      updateBuilder({ step: builder.step + 1 });
    }
  };

  const prevStep = () => {
    if (builder.step > 1) {
      updateBuilder({ step: builder.step - 1 });
    }
  };

  const handleCheckout = () => {
    const price = getStepPrice();
    updateBuilder({ price });
    navigate('/summary');
  };

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="page-container">
      <div className="builder-container">
        <div className="progress-bar">
          {STEPS.map((step, i) => (
            <div key={step} className={`progress-step ${builder.step === i + 1 ? 'active' : ''} ${builder.step > i + 1 ? 'completed' : ''}`}>
              <div className="step-circle">{builder.step > i + 1 ? '✓' : i + 1}</div>
              <span className="step-label">{step}</span>
            </div>
          ))}
        </div>

        {builder.step === 1 && (
          <div className="builder-step fade-in">
            <h2 className="step-title">Select Your Base</h2>
            <div className="options-grid">
              {inventory.base.map((item) => (
                <div
                  key={item._id}
                  className={`option-card ${builder.base?._id === item._id ? 'selected' : ''}`}
                  onClick={() => updateBuilder({ base: item })}
                >
                  <div className="option-name">{item.name}</div>
                  <div className="option-price">₹{item.price}</div>
                  <div style={{ fontSize: '0.8rem', color: item.stock > 0 ? 'var(--success)' : 'var(--danger)' }}>
                    {item.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {builder.step === 2 && (
          <div className="builder-step fade-in">
            <h2 className="step-title">Select Your Sauce</h2>
            <div className="options-grid">
              {inventory.sauce.map((item) => (
                <div
                  key={item._id}
                  className={`option-card ${builder.sauce?._id === item._id ? 'selected' : ''}`}
                  onClick={() => updateBuilder({ sauce: item })}
                >
                  <div className="option-name">{item.name}</div>
                  <div className="option-price">₹{item.price}</div>
                  <div style={{ fontSize: '0.8rem', color: item.stock > 0 ? 'var(--success)' : 'var(--danger)' }}>
                    {item.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {builder.step === 3 && (
          <div className="builder-step fade-in">
            <h2 className="step-title">Select Your Cheese</h2>
            <div className="options-grid">
              {inventory.cheese.map((item) => (
                <div
                  key={item._id}
                  className={`option-card ${builder.cheese?._id === item._id ? 'selected' : ''}`}
                  onClick={() => updateBuilder({ cheese: item })}
                >
                  <div className="option-name">{item.name}</div>
                  <div className="option-price">₹{item.price}</div>
                  <div style={{ fontSize: '0.8rem', color: item.stock > 0 ? 'var(--success)' : 'var(--danger)' }}>
                    {item.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {builder.step === 4 && (
          <div className="builder-step fade-in">
            <h2 className="step-title">Add Vegetables</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Select one or more vegetables</p>
            <div className="veg-options">
              {inventory.vegetable.map((item) => (
                <div
                  key={item._id}
                  className={`veg-option ${builder.vegetables.includes(item.name) ? 'selected' : ''}`}
                  onClick={() => item.stock > 0 && toggleVegetable(item.name)}
                  style={{ opacity: item.stock === 0 ? 0.5 : 1, cursor: item.stock === 0 ? 'not-allowed' : 'pointer' }}
                >
                  <div className="veg-checkbox">
                    {builder.vegetables.includes(item.name) && <span>&#10003;</span>}
                  </div>
                  <div>
                    <div className="option-name">{item.name}</div>
                    <div className="option-price">₹{item.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {builder.step === 5 && (
          <div className="builder-step fade-in">
            <h2 className="step-title">Your Custom Pizza</h2>
            <div className="summary-card">
              <div className="summary-row">
                <span className="summary-label">Base</span>
                <span className="summary-value">{builder.base?.name} — ₹{builder.base?.price}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Sauce</span>
                <span className="summary-value">{builder.sauce?.name} — ₹{builder.sauce?.price}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Cheese</span>
                <span className="summary-value">{builder.cheese?.name} — ₹{builder.cheese?.price}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Vegetables</span>
                <span className="summary-value">
                  {builder.vegetables.map(v => {
                    const veg = inventory.vegetable.find(i => i.name === v);
                    return `${v} (₹${veg?.price || 0})`;
                  }).join(', ')}
                </span>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span className="total-price">₹{getStepPrice()}</span>
              </div>
            </div>
          </div>
        )}

        <div className="builder-nav">
          {builder.step > 1 && (
            <button className="btn btn-outline" onClick={prevStep}>
              ← Back
            </button>
          )}
          <div style={{ flex: 1 }}></div>
          {builder.step < 5 ? (
            <button className="btn btn-primary btn-lg" onClick={nextStep} disabled={!canProceed()}>
              Continue →
            </button>
          ) : (
            <button className="btn btn-primary btn-lg" onClick={handleCheckout}>
              Proceed to Payment →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Builder;
