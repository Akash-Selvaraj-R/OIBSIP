# CRUST — Craft. Order. Track.

**A full-stack pizza ordering and inventory management platform**

---

## OASIS INFOBYTE SIP — Web Development & Designing — Level 3 Task 1

---

## Features

### User Features
- Email registration with verification
- JWT-based authentication
- Forgot password with email reset
- Pizza browsing dashboard
- Custom pizza builder (Base → Sauce → Cheese → Vegetables)
- Live price calculation
- Order summary with tax
- Razorpay test-mode payment checkout
- Real-time order status tracking via Socket.IO
- Order history

### Admin Features
- Separate admin authentication
- Dashboard with metrics (orders, users, stock alerts)
- Inventory management (bases, sauces, cheeses, vegetables)
- Manual stock updates (increase/decrease)
- Automatic stock decrement on successful orders
- Order management with status updates
- Low-stock threshold configuration
- Scheduled low-stock email alerts via node-cron

### Security
- bcrypt password hashing
- JWT token authentication
- Role-based access control
- Input validation
- Secure environment variables
- Razorpay secret kept server-side only
- Expiring verification/reset tokens

---

## Architecture

```
React (Vite) ──→ Express API ──→ MongoDB
                    │
                    ├── Razorpay (Payment)
                    ├── Nodemailer (Email)
                    ├── Socket.IO (Real-time)
                    └── node-cron (Scheduled Jobs)
```

---

## Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- Razorpay test account

### Installation

```bash
# Clone the project
cd crust

# Install all dependencies
npm run install:all

# Or install separately
cd server && npm install
cd ../client && npm install
```

### Environment Variables

Create `server/.env` based on `.env.example`:

```env
MONGODB_URI=mongodb://localhost:27017/crust
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
ADMIN_EMAIL=admin@crust.com
CLIENT_URL=http://localhost:5173
ADMIN_DEFAULT_PASSWORD=admin123
```

### Seed Database

```bash
npm run seed
```

This creates:
- Admin account (admin@crust.com / admin123)
- 5 pizza varieties
- Inventory items (5 bases, 5 sauces, 4 cheeses, 7 vegetables)

### Running

```bash
# Start both server and client
npm run dev

# Or separately
npm run server   # Backend on port 5000
npm run client   # Frontend on port 5173
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| GET | /api/auth/verify-email | Verify email |
| POST | /api/auth/login | Login |
| POST | /api/auth/forgot-password | Request password reset |
| POST | /api/auth/reset-password | Reset password |
| GET | /api/auth/me | Get current user |

### Pizzas
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/pizzas | List all pizzas |
| GET | /api/pizzas/:id | Get pizza details |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/orders | Create order |
| GET | /api/orders | List user orders |
| GET | /api/orders/:id | Get order details |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/payments/create-order | Create Razorpay order |
| POST | /api/payments/verify | Verify payment |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/admin/dashboard | Dashboard stats |
| GET | /api/admin/orders | All orders |
| PATCH | /api/admin/orders/:id/status | Update order status |
| GET | /api/admin/inventory | Inventory list |
| PATCH | /api/admin/inventory/:id | Update stock |
| GET | /api/admin/low-stock | Low stock items |

---

## Database Collections

- **users** — User accounts and authentication
- **pizzas** — Menu items
- **inventories** — Stock tracking for ingredients
- **orders** — Customer orders with status tracking

---

## Testing Checklist

### User Flow
- [ ] Register with email
- [ ] Verify email via link
- [ ] Login with credentials
- [ ] Browse pizza menu
- [ ] Build custom pizza (5 bases, 5 sauces, cheese, vegetables)
- [ ] View order summary with pricing
- [ ] Complete Razorpay test payment
- [ ] Track order status in real-time

### Admin Flow
- [ ] Login with admin credentials
- [ ] View dashboard metrics
- [ ] Manage inventory stock levels
- [ ] View and manage orders
- [ ] Update order status (Order Received → In Kitchen → Sent to Delivery)
- [ ] Verify low-stock email alerts

### Security
- [ ] Passwords are hashed
- [ ] JWT routes are protected
- [ ] Admin routes require admin role
- [ ] Razorpay secret is server-side only
- [ ] Tokens expire appropriately

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| Payment | Razorpay Test Mode |
| Real-time | Socket.IO |
| Email | Nodemailer |
| Scheduling | node-cron |

---

## License

MIT
