# Inventory Management System

A minimal, responsive web application for managing users, products, and inventory stock changes.

---

## Local Setup

### 1. Environment Variables
Create a `.env` file in the root directory:
```env
PORT=3000
MONGO_URI="your_mongodb_connection_string"
NODE_ENV=development
```

### 2. Installation
Install dependencies for both folders:
```bash
# Install backend/frontend dependencies
npm run install:all

```

### 3. Running the App
Start both servers locally:
```bash
# Terminal 1: Start Backend API (Port 3000)
npm start

# Terminal 2: Start Frontend Dev Server
cd frontend && npm run dev
```

---

## Architecture Note

### Database Schema (MongoDB/Mongoose)

1. **User**
   - `fullname` (String)
   - `email` (String, unique)

2. **Product**
   - `sku` (String, unique)
   - `name` (String)
   - `price` (Number)
   - `quantity` (Number, non-negative integer)
   - `createdBy` (ObjectId, ref: User)

3. **Transaction** (Ledger)
   - `product` (ObjectId, ref: Product)
   - `changeAmount` (Number)
   - `type` (Enum: "increase", "decrease", "initial")
   - `quantityAfter` (Number)
   - `performedBy` (ObjectId, ref: User)

### API Design

- **Users**:
  - `POST /api/users` - Register a new user
  - `GET /api/users` - Fetch all users
- **Products**:
  - `POST /api/products` - Register a new product (creates an "initial" transaction if stock > 0)
  - `GET /api/products` - Fetch all products
  - `PATCH /api/products/:id/stock` - Adjust product stock level (prevents stock < 0, adds ledger record)
- **Transactions**:
  - `GET /api/transactions` - Fetch paginated audit ledger history

### Technical Trade-Offs

- **MERN Stack**: Handled with Node/Express and MongoDB to maximize rapid prototype development. 
- **Controller-Level Validation Check**: Validates that stock adjustments won't result in a negative quantity during the update controller transaction step. At scale, atomic `$inc` updates with database schema boundary conditions would be utilized to prevent write race conditions.
- **Redux Toolkit Query**: Used for centralized state caching and query auto-invalidation, keeping the user interface instantly in sync across the dashboard, ledger, and forms.
