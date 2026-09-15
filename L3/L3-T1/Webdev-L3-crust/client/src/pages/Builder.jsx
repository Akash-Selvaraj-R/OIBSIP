import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePizza } from '../context/PizzaContext';
import { inventoryAPI } from '../services/api';
import toast from 'react-hot-toast';

const STEPS = ['Base', 'Sauce', 'Cheese', 'Veggies', 'Summary'];

const STEP_LABELS = {
  1: 'BASE',
  2: 'SAUCE',
  3: 'CHEESE',
  4: 'TOPPINGS',
  5: 'REVIEW',
};

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
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <div className="loading-text">Loading ingredients...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="builder-container">
        <div className="builder-header">
          <h1>
            BUILD<br />
            YOUR<br />
            <span className="step-label">PIZZA</span>
          </h1>
        </div>

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
            <h2 className="step-title">STEP 01 — BASE</h2>
            <div className="options-grid">
              {inventory.base.map((item) => (
                <div
                  key={item._id}
                  className={`option-card ${builder.base?._id === item._id ? 'selected' : ''}`}
                  onClick={() => updateBuilder({ base: item })}
                  role="button"
                  tabIndex={0}
                  aria-pressed={builder.base?._id === item._id}
                  onKeyDown={(e) => e.key === 'Enter' && updateBuilder({ base: item })}
                >
                  <div className="option-name">{item.name}</div>
                  <div className="option-price">₹{item.price}</div>
                  <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: '0.25rem', color: item.stock > 0 ? 'var(--green)' : 'var(--danger)' }}>
                    {item.stock > 0 ? '● IN STOCK' : '● OUT OF STOCK'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {builder.step === 2 && (
          <div className="builder-step fade-in">
            <h2 className="step-title">STEP 02 — SAUCE</h2>
            <div className="options-grid">
              {inventory.sauce.map((item) => (
                <div
                  key={item._id}
                  className={`option-card ${builder.sauce?._id === item._id ? 'selected' : ''}`}
                  onClick={() => updateBuilder({ sauce: item })}
                  role="button"
                  tabIndex={0}
                  aria-pressed={builder.sauce?._id === item._id}
                  onKeyDown={(e) => e.key === 'Enter' && updateBuilder({ sauce: item })}
                >
                  <div className="option-name">{item.name}</div>
                  <div className="option-price">₹{item.price}</div>
                  <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: '0.25rem', color: item.stock > 0 ? 'var(--green)' : 'var(--danger)' }}>
                    {item.stock > 0 ? '● IN STOCK' : '● OUT OF STOCK'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {builder.step === 3 && (
          <div className="builder-step fade-in">
            <h2 className="step-title">STEP 03 — CHEESE</h2>
            <div className="options-grid">
              {inventory.cheese.map((item) => (
                <div
                  key={item._id}
                  className={`option-card ${builder.cheese?._id === item._id ? 'selected' : ''}`}
                  onClick={() => updateBuilder({ cheese: item })}
                  role="button"
                  tabIndex={0}
                  aria-pressed={builder.cheese?._id === item._id}
                  onKeyDown={(e) => e.key === 'Enter' && updateBuilder({ cheese: item })}
                >
                  <div className="option-name">{item.name}</div>
                  <div className="option-price">₹{item.price}</div>
                  <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: '0.25rem', color: item.stock > 0 ? 'var(--green)' : 'var(--danger)' }}>
                    {item.stock > 0 ? '● IN STOCK' : '● OUT OF STOCK'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {builder.step === 4 && (
          <div className="builder-step fade-in">
            <h2 className="step-title">STEP 04 — TOPPINGS</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              SELECT ONE OR MORE
            </p>
            <div className="veg-options">
              {inventory.vegetable.map((item) => (
                <div
                  key={item._id}
                  className={`veg-option ${builder.vegetables.includes(item.name) ? 'selected' : ''}`}
                  onClick={() => item.stock > 0 && toggleVegetable(item.name)}
                  role="checkbox"
                  aria-checked={builder.vegetables.includes(item.name)}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && item.stock > 0 && toggleVegetable(item.name)}
                  style={{ opacity: item.stock === 0 ? 0.4 : 1, cursor: item.stock === 0 ? 'not-allowed' : 'pointer' }}
                >
                  <div className="veg-checkbox">
                    {builder.vegetables.includes(item.name) && <span>✓</span>}
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
            <h2 className="step-title">YOUR CREATION</h2>
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
                <span className="summary-label">Toppings</span>
                <span className="summary-value">
                  {builder.vegetables.map(v => {
                    const veg = inventory.vegetable.find(i => i.name === v);
                    return `${v} (₹${veg?.price || 0})`;
                  }).join(', ')}
                </span>
              </div>
              <div className="summary-total">
                <span>TOTAL</span>
                <span className="total-price">₹{getStepPrice()}</span>
              </div>
            </div>
          </div>
        )}

        <div className="builder-nav">
          {builder.step > 1 && (
            <button className="btn btn-outline" onClick={prevStep}>
              ← BACK
            </button>
          )}
          <div style={{ flex: 1 }}></div>
          {builder.step < 5 ? (
            <button className="btn btn-primary btn-lg" onClick={nextStep} disabled={!canProceed()}>
              CONTINUE →
            </button>
          ) : (
            <button className="btn btn-primary btn-lg" onClick={handleCheckout}>
              PROCEED TO PAYMENT →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Builder;
