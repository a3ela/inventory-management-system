# Inventory Management System

A production-ready, responsive MERN-stack web application designed for managing users, products, and real-time inventory stock alterations with an integrated audit ledger.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Render-brightgreen)](https://inventory-management-system-3qxp.onrender.com/)

---

## Features

- **User Registration** — Capture user full name and email; users are referenced across products and transactions for full audit traceability.
- **Product Registration** — Capture SKU, product name, price, and initial quantity, linked to the user who created it.
- **Inventory Management** — Increase or decrease product stock through a guided form, with server-side validation that prevents stock from dropping below zero.
- **Product Dashboard** — View all products with SKU, current quantity (color-coded by stock level), creator, and last-updated timestamp.
- **Transaction Ledger** — Paginated, searchable history of every stock change, including type, amount, resulting quantity, and who performed it.
- **Search** — Debounced backend search across Products (by name or SKU) and Transactions (by related product name or SKU), avoiding excessive API calls while typing.
- **Pagination** — Windowed pagination on the Transaction Ledger (e.g. `1 ... 4 5 6 ... 20`) to stay performant as transaction history grows.

## Tech Stack

- **Frontend:** React (Vite), Redux Toolkit Query, React Router, SCSS (BEM methodology)
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB
- **Validation:** express-validator (request-level) + Mongoose schema validation (data-level)

---

## Local Development Setup

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v18+ recommended) and a [MongoDB](https://www.mongodb.com/) instance ready.

### 2. Environment Configurations
Create a `.env` file in the **root directory** and populate it with the following environment variables:

```env
PORT=5000
MONGO_URI="your_mongodb_connection_string"
NODE_ENV=development
```

Create a separate `.env` file inside `frontend/` with:

```env
VITE_API_URL=http://localhost:5000
```

### 3. Installation

Install all project dependencies across the root, backend, and frontend environments simultaneously:

```bash
npm install && npm install --prefix frontend
```

### 4. Executing the Application

You can spin up both the Express backend API and Vite frontend development server concurrently using a single command:

```bash
npm run dev
```

---

## Architecture & System Design

### Database Schema (MongoDB / Mongoose)

#### 1. User
- `fullname` (String) — Required.
- `email` (String) — Required, unique.

#### 2. Product
- `sku` (String) — Unique identifier.
- `name` (String) — Required.
- `price` (Number) — Asset valuation.
- `quantity` (Number) — Current stock level (non-negative integer constraint).
- `createdBy` (ObjectId) — Relation reference mapping to User.

#### 3. Transaction (Audit Ledger)
- `product` (ObjectId) — Relation reference mapping to Product.
- `changeAmount` (Number) — Delta value of stock modification.
- `type` (Enum) — Segregated into `["increase", "decrease", "initial"]`.
- `quantityAfter` (Number) — Post-transaction snapshot of inventory levels.
- `performedBy` (ObjectId) — Relation reference mapping to User.

## API Specification

| Endpoint | HTTP Method | Description |
| :--- | :--- | :--- |
| `/api/users` | `POST` | Register a new user platform profile |
| `/api/users` | `GET` | Retrieve list of all platform users |
| `/api/products` | `POST` | Register a new product (initializes "initial" ledger record if stock > 0) |
| `/api/products` | `GET` | Retrieve list of all available products. Supports `?search=` to filter by name or SKU |
| `/api/products/:id` | `GET` | Retrieve a single product's details |
| `/api/products/:id/stock` | `PATCH` | Modify existing inventory volume (blocks negative results, pushes ledger log) |
| `/api/transactions` | `GET` | Retrieve comprehensive, paginated audit ledger history. Supports `?page=`, `?limit=`, and `?search=` (matches related product name or SKU) |
| `/api/transactions/:productId` | `GET` | Retrieve paginated transaction history for a single product |

### Technical Trade-Offs & Decisions

- **MERN Architecture Selection**: Leveraged a Node/Express REST API and a decoupled React frontend to decouple concerns and accelerate rapid component scaffolding.
- **Race Condition & Validation Handling**: Validation constraints are actively managed at the controller layer to verify that stock alterations do not fall beneath baseline zero logic. Note: In a high-concurrency production system, atomic database-level operations (`$inc` operators with strict validation rules) would be used to prevent write race conditions.
- **State Operations via RTK Query**: Implemented Redux Toolkit Query (via a single injected `apiSlice`) for advanced server-state caching, background data synchronization, and automated query invalidation, keeping data unified across dashboard visuals, loggers, and form actions.
- **Debounced Search**: Search inputs debounce at 400ms before triggering a backend request, reducing redundant API calls during fast typing while keeping search results accurate and current.
- **Windowed Pagination**: Rather than rendering a button for every page, the Transaction Ledger uses a windowed pagination pattern (showing first, last, and pages near the current one) to remain usable as transaction volume scales.