# Project: Threadly — MERN Clothing E-Commerce Platform

## Overview
Build a full-stack MERN (MongoDB, Express, React, Node.js) e-commerce web application for an online clothing store. The platform has two sides: a **customer-facing storefront** and a **single-admin dashboard** for managing the store. This is a portfolio project meant to demonstrate full-stack development skills, so code should be clean, well-structured, and follow best practices.

## Tech Stack
- **Frontend:** React (Vite), Tailwind CSS, React Router v6, Redux Toolkit (cart, auth, products state), Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose ODM
- **Auth:** JWT (access token), bcrypt for password hashing
- **File/Image upload:** Multer + Cloudinary (or local `/uploads` folder if Cloudinary not available)
- **Payments:** Stripe (test mode)
- **Charts (dashboard):** Recharts
- **Email:** Nodemailer (order confirmation emails) — optional/stretch
- **Deployment target:** Client → Vercel, Server → Render/Railway, DB → MongoDB Atlas

## Folder Structure
```
threadly/
├── client/
│   └── src/
│       ├── components/        # Navbar, Footer, ProductCard, SizeSelector, etc.
│       ├── pages/
│       │   ├── shop/          # Home, ProductList, ProductDetail, Cart, Checkout, OrderHistory
│       │   └── admin/         # Dashboard, Products, Orders, Users, Analytics
│       ├── redux/             # authSlice, cartSlice, productSlice
│       ├── api/                # axios instance + API call functions
│       ├── routes/             # ProtectedRoute, AdminRoute
│       └── App.jsx
├── server/
│   ├── models/                 # User.js, Product.js, Order.js, Review.js
│   ├── routes/                 # authRoutes, productRoutes, orderRoutes, userRoutes
│   ├── controllers/
│   ├── middleware/             # authMiddleware, adminMiddleware, errorHandler
│   ├── config/                 # db.js, cloudinary.js
│   └── server.js
```

## Data Models

**User**
- name, email, password (hashed), role (`customer` | `admin`), address, phone, createdAt

**Product**
- name, description, price, discountPrice (optional), category (e.g. men/women/kids), subCategory (e.g. shirts/jeans/jackets), sizes (array: S, M, L, XL...), colors (array), stock (per size if possible), images (array of URLs), brand, ratings (avg), numReviews, isFeatured, createdAt

**Order**
- user (ref), orderItems [{ product, name, size, color, qty, price, image }], shippingAddress, paymentMethod, paymentResult (Stripe info), itemsPrice, shippingPrice, totalPrice, isPaid, paidAt, status (`pending` | `processing` | `shipped` | `delivered` | `cancelled`), createdAt

**Review**
- user (ref), product (ref), rating (1-5), comment, createdAt

## Feature Requirements

### Customer Storefront
1. Home page — hero banner, featured products, new arrivals, category navigation
2. Product listing page — filter by category, size, color, price range; sort by price/newest/rating; pagination
3. Product detail page — image gallery, size/color selector, stock-aware "add to cart", reviews + ratings, related products
4. Cart — add/remove/update quantity, persists in Redux + localStorage
5. Auth — register/login/logout (JWT), protected checkout
6. Checkout — shipping address form, Stripe payment, order summary
7. Order history page — list past orders, order detail with status tracker
8. Wishlist (stretch) — save products for later
9. Search bar with debounce

### Admin Dashboard (role-protected, `/admin/*`)
1. Dashboard home — key metrics cards (total revenue, total orders, total products, total customers) + revenue chart (Recharts, last 7/30 days)
2. Product management — table view, create/edit/delete product, image upload, stock per size, mark featured
3. Order management — table view, filter by status, update order status, view order detail
4. User management — list customers, view their orders
5. Low-stock alert indicator on products with stock below threshold
6. Best-selling products widget

## Non-Functional Requirements
- Input validation on both frontend (forms) and backend (Express middleware, e.g. express-validator)
- Centralized error handling middleware on the backend
- Protect admin routes with middleware checking `role === 'admin'`
- Passwords hashed with bcrypt, never returned in API responses
- Environment variables via `.env` (Mongo URI, JWT secret, Stripe keys, Cloudinary keys) — provide a `.env.example`
- Responsive design (mobile-first) using Tailwind
- Loading states and error states on all data-fetching UI
- Basic SEO-friendly meta tags on storefront pages (stretch)

## Build Order (MVP first, then enhance)
1. Backend: User model + JWT auth (register/login/me)
2. Backend: Product model + CRUD routes (public GET, admin-only POST/PUT/DELETE)
3. Frontend: Setup, routing, Navbar/Footer, product listing + detail pages (read-only, connected to API)
4. Frontend: Cart with Redux (local state only, no backend yet)
5. Backend: Order model + create order route; Frontend: checkout flow + Stripe test payment
6. Frontend: Order history page
7. Admin dashboard: protected admin routes, product management UI, order management UI
8. Admin dashboard: analytics cards + revenue chart
9. Reviews & ratings
10. Polish: validation, error handling, responsive QA, deploy

## Stretch Goals (only after MVP works end-to-end)
- Wishlist
- Coupon/discount codes
- CSV export of orders
- Real-time order status via Socket.io
- Email notifications via Nodemailer
- Dark mode

## Deliverable Expectations
Working full-stack app runnable locally with `npm run dev` in both `client/` and `server/`, with a `README.md` covering setup steps, environment variables needed, and a short feature list.
