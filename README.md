# Threadly — MERN Clothing E-Commerce

A full-stack clothing e-commerce platform built with the MERN stack. Features a complete customer storefront and a fully responsive admin dashboard.

> **Portfolio project** — built to demonstrate full-stack development with real-world features like Cash on Delivery, order tracking, analytics, and role-based access control.

---

## Live Demo

| | URL |
|---|---|
| **Frontend** | https://threadly-ecommerce.vercel.app |

### Demo Accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@threadly.com | admin123 |
| Customer | user@threadly.com | user123 |

---

## Screenshots

### Storefront
- Hero landing page with sage green theme
- Product listing with filters, search, and sorting
- Product detail with size selector, reviews, and star ratings
- Cart, checkout with Cash on Delivery option
- Order history with visual tracking timeline

### Admin Panel
- Dashboard with revenue chart, metric cards, and best sellers
- Product management (URL-based images, no Cloudinary needed)
- Order management with inline status updates
- Users split into Customers / Admins tabs

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS v3, Redux Toolkit |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT + bcryptjs |
| Payments | Cash on Delivery (default) + Stripe (card) |
| Charts | Recharts |
| Deployment | Vercel (client) + Railway (server) |

---

## Features

### Customer Storefront
- Sage green themed UI with Dancing Script logo
- Product listing — filter by category, size, color, price range; sort by price / newest / rating
- Product detail — image gallery, size picker, stock badge, discount % badge
- Star ratings and reviews (only after order is delivered)
- Shopping cart with persistent Redux + localStorage state
- Checkout — Cash on Delivery (default) or Card payment
- Free shipping on orders above Rs. 10,000
- Order history with payment method badges
- **Order tracking page** — visual 4-step journey (Placed → Packed → In Transit → Delivered) with real timestamps
- Search by keyword
- Password show/hide toggle on login and register

### Admin Dashboard (`/admin`) — Fully Responsive
- Slide-out sidebar on mobile with hamburger toggle
- Revenue area chart (last 7 / 30 / 90 days)
- Metric cards: total revenue, orders, products, customers
- Pending COD banner with total outstanding amount
- Best-selling products widget
- Product management — add/edit/delete, URL-based images, per-size stock, featured toggle
- Order management — filter by status, inline status dropdown, payment info
- User management — separate Customers and Admins tabs, Make Admin / Remove Admin, self-protection (can't delete or demote yourself)
- Demo credentials shown on login page for easy testing

### Security & Business Logic
- JWT authentication with role stored in database (not just localStorage)
- Auto-refresh role from server on every app load — prevents stale admin role issues
- Admin self-protection: cannot delete own account or change own role
- COD orders auto-mark as paid when admin sets status to "delivered"
- Reviews require order to be delivered (not just paid)
- Order status history with timestamps for full tracking timeline

---

## Project Structure

```
threadly/
├── client/                  # React frontend (Vite)
│   └── src/
│       ├── api/             # Axios instance + API functions
│       ├── components/      # Navbar, Footer, ProductCard, Loader, Message
│       ├── pages/
│       │   ├── shop/        # Home, Products, Cart, Checkout, Orders, Track, Login, Register
│       │   └── admin/       # Dashboard, Products, Orders, Users, ProductForm
│       ├── redux/           # authSlice, cartSlice, store
│       ├── routes/          # ProtectedRoute, AdminRoute
│       └── utils/           # formatPrice (PKR formatter)
└── server/                  # Express backend
    ├── config/              # db.js
    ├── controllers/         # auth, product, order, user, review
    ├── middleware/          # auth, admin, errorHandler
    ├── models/              # User, Product, Order, Review
    ├── routes/              # All API routes
    ├── scripts/             # seed.js (8 products + demo users)
    └── server.js
```

---

## Getting Started (Local)

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)

### 1. Clone the repo

```bash
git clone https://github.com/mohammadawan/threadly-ecommerce.git
cd threadly-ecommerce
```

### 2. Setup the Backend

```bash
cd server
npm install
```

Create `server/.env`:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/threadly
JWT_SECRET=your_secret_here
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_your_key
```

Seed the database with sample products and users:

```bash
npm run seed
```

Start the server:

```bash
npm run dev
```

Server runs on `http://localhost:5000`

### 3. Setup the Frontend

```bash
cd client
npm install
```

Create `client/.env`:

```env
VITE_API_URL=/api
```

Start the client:

```bash
npm run dev
```

Client runs on `http://localhost:5173`

---

## API Endpoints

### Auth
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Protected |
| PUT | `/api/auth/me` | Protected |

### Products
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/products` | Public |
| GET | `/api/products/featured` | Public |
| GET | `/api/products/:id` | Public |
| POST | `/api/products` | Admin |
| PUT | `/api/products/:id` | Admin |
| DELETE | `/api/products/:id` | Admin |

### Orders
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/orders` | Protected |
| GET | `/api/orders/myorders` | Protected |
| GET | `/api/orders/:id` | Protected |
| GET | `/api/orders` | Admin |
| PUT | `/api/orders/:id/status` | Admin |
| GET | `/api/orders/analytics` | Admin |

### Reviews
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/products/:id/reviews` | Public |
| POST | `/api/products/:id/reviews` | Protected (delivered orders only) |

### Users
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/users` | Admin |
| DELETE | `/api/users/:id` | Admin |
| PUT | `/api/users/:id/role` | Admin |

---

## Deployment

### Backend → Railway

1. [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Set root directory to `server`
3. Add environment variables (production values)
4. Set `NODE_ENV=production`
5. Copy the Railway URL

### Frontend → Vercel

1. [vercel.com](https://vercel.com) → New Project → Import GitHub repo
2. Set **Root Directory** to `client`
3. Add environment variable: `VITE_API_URL=https://your-railway-url.railway.app/api`
4. Deploy

After deploying both, update `CLIENT_URL` in Railway to your Vercel URL.

---

## Environment Variables

### Server
| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | Yes | MongoDB Atlas connection string |
| `JWT_SECRET` | Yes | Secret for JWT signing |
| `JWT_EXPIRE` | Yes | JWT expiry (e.g. `30d`) |
| `CLIENT_URL` | Yes | Frontend URL for CORS |
| `STRIPE_SECRET_KEY` | Optional | Stripe secret key (only for card payments) |

### Client
| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Yes | Backend API base URL |

---

## License

MIT — free to use for portfolio and learning purposes.
