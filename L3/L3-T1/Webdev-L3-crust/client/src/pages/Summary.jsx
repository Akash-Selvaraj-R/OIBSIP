import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePizza } from '../context/PizzaContext';
import { useAuth } from '../context/AuthContext';
import { paymentAPI, orderAPI } from '../services/api';
import toast from 'react-hot-toast';

const Summary = () => {
  const { builder, resetBuilder } = usePizza();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const calculateTotal = () => {
    let price = 0;
    if (builder.base) price += builder.base.price;
    if (builder.sauce) price += builder.sauce.price;
    if (builder.cheese) price += builder.cheese.price;
    builder.vegetables.forEach(vegName => {
      const veg = { price: 15 };
      price += veg.price;
    });
    const tax = Math.round(price * 0.05);
    return { subtotal: price, tax, total: price + tax };
  };

  const { subtotal, tax, total } = calculateTotal();

  const handlePayment = async () => {
    if (!address.trim() || !phone.trim()) {
      return toast.error('Please fill in delivery address and phone');
    }

    setLoading(true);
    try {
      const { data: orderData } = await paymentAPI.createOrder({ amount: total });

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'CRUST',
        description: 'Custom Pizza Order',
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            const { data: verifyData } = await paymentAPI.verify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyData.verified) {
              await orderAPI.create({
                customPizza: {
                  base: builder.base?.name,
                  sauce: builder.sauce?.name,
                  cheese: builder.cheese?.name,
                  vegetables: builder.vegetables,
                  price: subtotal
                },
                amount: total,
                deliveryAddress: address,
                phone
              });

              await orderAPI.updatePayment({
                orderId: null,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
              });

              toast.success('Order placed successfully!');
              resetBuilder();
              navigate('/orders');
            }
          } catch (error) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: phone
        },
        theme: {
          color: '#D42B2B'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        toast.error('Payment failed: ' + response.error?.description);
      });
      rzp.open();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Payment initialization failed');
    } finally {
      setLoading(false);
    }
  };

  if (!builder.base) {
    navigate('/build');
    return null;
  }

  return (
    <div className="page-container">
      <div className="builder-container">
        <div className="page-header">
          <div className="brand-stamp red" style={{ marginBottom: '1rem' }}>CHECKOUT</div>
          <h1 className="page-title">ORDER<br />SUMMARY</h1>
          <p className="page-subtitle">Review your custom pizza before checkout</p>
        </div>

        <div className="summary-card fade-in">
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
            YOUR CUSTOM PIZZA
          </h3>

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
            <span className="summary-value">{builder.vegetables.join(', ')}</span>
          </div>

          <div style={{ borderTop: '3px solid var(--black)', margin: '1rem 0', paddingTop: '1rem' }}>
            <div className="summary-row">
              <span className="summary-label">Subtotal</span>
              <span className="summary-value">₹{subtotal}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Tax (5%)</span>
              <span className="summary-value">₹{tax}</span>
            </div>
            <div className="summary-total">
              <span>TOTAL</span>
              <span className="total-price">₹{total}</span>
            </div>
          </div>
        </div>

        <div className="summary-card fade-in" style={{ marginTop: '1.5rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
            DELIVERY DETAILS
          </h3>

          <div className="form-group">
            <label className="form-label">Delivery Address</label>
            <textarea
              className="form-input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your full delivery address"
              rows={3}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              className="form-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Your phone number"
              required
            />
          </div>
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
          <button className="btn btn-outline btn-lg" onClick={() => navigate('/build')}>
            ← MODIFY PIZZA
          </button>
          <button
            className="btn btn-primary btn-lg"
            style={{ flex: 1 }}
            onClick={handlePayment}
            disabled={loading || !address.trim() || !phone.trim()}
          >
            {loading ? 'PROCESSING...' : `PAY ₹${total} — PLACE ORDER`}
          </button>
        </div>

        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </div>
    </div>
  );
};

export default Summary;
