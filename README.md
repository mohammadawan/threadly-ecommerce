# Threadly — MERN Clothing E-Commerce

A full-stack clothing e-commerce platform built with the MERN stack. Features a customer storefront and a full admin dashboard.

## Live Demo

- **Frontend:** (Vercel URL here)
- **Backend:** (Railway URL here)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Redux Toolkit |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT + bcryptjs |
| Payments | Stripe |
| Image Upload | Cloudinary |
| Charts | Recharts |
| Deployment | Vercel (client) + Railway (server) |

---

## Features

### Customer Storefront
- Home page with hero banner, featured products, and category navigation
- Product listing with filters (category, size, color, price range), sorting, and pagination
- Product detail page with image gallery, size/color selector, and stock awareness
- Reviews & ratings (only verified purchasers can review)
- Shopping cart persisted in Redux + localStorage
- Secure checkout with Stripe payment
- Order history with real-time status tracker
- Wishlist (add/remove saved products)
- Search with keyword filtering

### Admin Dashboard (`/admin`)
- Revenue chart (last 7 / 30 / 90 days) with Recharts
- Metric cards: total revenue, orders, products, customers
- Product management: create, edit, delete, image upload, stock per size, featured toggle
- Order management: filter by status, update order status
- Customer management: list and delete users
- Best-selling products widget
- Low-stock alerts

---

## Project Structure

```
threadly/
├── client/                  # React frontend (Vite)
│   └── src/
│       ├── api/             # Axios instance + API functions
│       ├── components/      # Navbar, Footer, ProductCard, etc.
│       ├── pages/
│       │   ├── shop/        # Home, ProductList, Cart, Checkout, Orders
│       │   └── admin/       # Dashboard, Products, Orders, Users
│       ├── redux/           # authSlice, cartSlice, store
│       └── routes/          # ProtectedRoute, AdminRoute
└── server/                  # Express backend
    ├── config/              # db.js, cloudinary.js
    ├── controllers/         # auth, product, order, user, review, wishlist
    ├── middleware/          # auth, admin, errorHandler, upload
    ├── models/              # User, Product, Order, Review
    ├── routes/              # All API routes
    ├── scripts/             # seed.js
    └── server.js
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Stripe account (test mode)
- Cloudinary account

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/threadly.git
cd threadly
```

### 2. Setup the Backend

```bash
cd server
npm install
```

Create a `.env` file in `server/`:

```env
NODE_ENV=development
PORT=5000

MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/threadly

JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=30d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret

CLIENT_URL=http://localhost:5173
```

Seed sample data (optional):

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

Create a `.env` file in `client/`:

```env
VITE_API_URL=/api
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
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
| GET | `/api/products/low-stock` | Admin |

### Orders
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/orders` | Protected |
| GET | `/api/orders/myorders` | Protected |
| GET | `/api/orders/:id` | Protected |
| PUT | `/api/orders/:id/pay` | Protected |
| GET | `/api/orders` | Admin |
| PUT | `/api/orders/:id/status` | Admin |
| GET | `/api/orders/analytics` | Admin |

### Reviews
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/products/:id/reviews` | Public |
| POST | `/api/products/:id/reviews` | Protected (verified buyers only) |
| DELETE | `/api/products/:id/reviews/:reviewId` | Protected |

### Wishlist
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/wishlist` | Protected |
| POST | `/api/wishlist/:productId` | Protected |
| DELETE | `/api/wishlist/:productId` | Protected |

---

## Deployment

### Backend → Railway

1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Select the `server` folder as the root directory
3. Add all environment variables from `.env` (use production values)
4. Set `NODE_ENV=production`
5. Copy the generated Railway URL

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
2. Set **Root Directory** to `client`
3. Add environment variables:
   - `VITE_API_URL` = `https://your-railway-url.railway.app/api`
   - `VITE_STRIPE_PUBLIC_KEY` = your Stripe publishable key
4. Deploy

### After Deployment
- Update `CLIENT_URL` in Railway to your Vercel URL (for CORS)
- Update `VITE_API_URL` in Vercel to your Railway URL

---

## Default Admin Account (after seeding)

```
Email:    admin@threadly.com
Password: admin123
```

---

## Environment Variables Reference

### Server
| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `JWT_EXPIRE` | JWT expiry (e.g. `30d`) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret (`whsec_...`) |
| `CLIENT_URL` | Frontend URL for CORS |

### Client
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |
| `VITE_STRIPE_PUBLIC_KEY` | Stripe publishable key (`pk_test_...`) |

---

## License

MIT
