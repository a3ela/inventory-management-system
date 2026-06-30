# Inventory Management System (MERN Stack Take-Home Assignment)

A fully functional, responsive, and robust Inventory Management System built as a take-home assignment for the Fullstack Developer Internship role at **Ellatech**.

The application features a responsive dashboard interface, a robust RESTful API backend, server-side validation using express-validator, database persistence using MongoDB (via Mongoose), state management using Redux Toolkit, and elegant styling using custom SCSS with modern glassmorphism/dark-theme accents.

---

## 🚀 Quick Start & Local Setup

This project is organized as a monorepo containing a `/backend` folder for the Node/Express server and a `/frontend` folder for the React/Vite single-page application.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v16+ recommended) and [npm](https://www.npmjs.com/) installed on your machine. You will also need a running MongoDB instance (either local or MongoDB Atlas).

---

### 1. Environment Variables Configuration

Create a `.env` file in the root directory. A sample configuration is shown below:

```env
PORT=3000
MONGO_URI="your-mongodb-connection-string"
NODE_ENV=development
```

> **Note:** For convenience, the pre-configured `.env` file uses a cloud MongoDB Atlas URI (`mongodb+srv://...`). You can customize the `MONGO_URI` to point to a local instance if desired.

---

### 2. Dependency Installation

To install all dependencies for both the backend and frontend, run the following commands from the root directory:

**Install Root & Backend Dependencies:**
```bash
npm install
```

**Install Frontend Dependencies:**
```bash
cd frontend
npm install
cd ..
```

---

### 3. Startup Scripts

You can run the backend and frontend concurrently or in separate terminals.

#### Option A: Running separately (Recommended)

1. **Start the Express API Server:**
   In the root directory, run:
   ```bash
   npm start
   ```
   *The server will start running on port 3000 (or the port specified in your `.env`).*

2. **Start the Frontend Development Server:**
   In another terminal, navigate to the frontend folder and run:
   ```bash
   cd frontend
   npm run dev
   ```
   *Vite will start the application (typically on [http://localhost:5173/](http://localhost:5173/)).*

#### Option B: Production Build (Frontend)
To compile the frontend project for production deployment, run the following commands inside `/frontend`:
```bash
npm run build
npm run preview
```

---

## 🏛️ Architecture Note

### 1. Database Schema

The persistence layer is modeled with MongoDB using Mongoose schemas to represent three distinct entities:

#### **User Schema (`User`)**
Stores user information to perform actions as actors inside the ledger system.
- `fullname` (String, required, min 3, max 100 characters)
- `email` (String, required, unique, validated email format)
- `timestamps` (`createdAt`, `updatedAt`)

#### **Product Schema (`Product`)**
Maintains the master list of items and their current inventory level.
- `sku` (String, unique, required, matches alphanumeric pattern with hyphens/underscores, min 3, max 20 characters)
- `name` (String, required, min 3, max 100 characters)
- `price` (Number, required, non-negative, up to 2 decimal places)
- `quantity` (Number, required, non-negative integer, default `0`)
- `createdBy` (ObjectId, ref: `User`, required)
- `timestamps` (`createdAt`, `updatedAt`)

#### **Transaction Schema (`Transaction`)**
A read-only ledger representing the full audit trail of stock modifications.
- `product` (ObjectId, ref: `Product`, required)
- `changeAmount` (Number, required)
- `type` (String, enum: `["increase", "decrease", "initial"]`, required)
- `quantityAfter` (Number, required, non-negative)
- `performedBy` (ObjectId, ref: `User`, required)
- `timestamps` (`createdAt`, `updatedAt`)

---

### 2. RESTful API Design

The backend API exposes semantic HTTP endpoints structured under `/api`:

| Method | Endpoint | Description | Validation Constraints |
|:---|:---|:---|:---|
| **POST** | `/api/users` | Creates a new user | Full name (>=3 chars), Email (valid email format, unique) |
| **GET** | `/api/users` | Lists all users | Returns name, email, ID, and creation date |
| **POST** | `/api/products` | Creates a new product | SKU (unique, format matches), Price (>=0, max 2 decimals), Qty (non-negative int) |
| **GET** | `/api/products` | Retrieves all products | Populates creator details; sorted by newest update |
| **GET** | `/api/products/:id` | Retrieves product detail | Looks up by standard Mongo ObjectId |
| **PATCH**| `/api/products/:id/stock` | Modifies stock levels | Validates that stock changes do not drop final balance < 0 |
| **GET** | `/api/transactions` | Retrieves ledger history | Paginated list populated with product & user schemas |
| **GET** | `/api/transactions/:productId`| Product stock history | Paginated history filtered by specific product |

---

### 3. Technical Trade-Offs

During development, the following trade-offs were chosen to satisfy the requirements under the 7–8 hour time budget:

1. **Monorepo Structure over Dockerization:**
   - *Trade-off:* We structured the application as separate `/frontend` and `/backend` packages within a single repository rather than wrapping them in a Docker Compose layout.
   - *Rationale:* Keeps setup extremely fast and simple for interviewers checking the code, omitting setup complexities associated with multi-container virtual volumes.

2. **MongoDB / Document-Based DB over SQL (PostgreSQL):**
   - *Trade-off:* Used MongoDB with Mongoose instead of PostgreSQL with Prisma or Sequelize.
   - *Rationale:* Excellent support for rapid development and dynamic querying. Document models seamlessly store flexible metadata, and populated paths provide rapid serialization. In high-concurrency environments, a relational DB with strict transaction levels (`SERIALIZABLE` or `SELECT FOR UPDATE` locks) would be preferred to handle double-booking anomalies securely.

3. **Mongoose Populates over SQL Joins:**
   - *Trade-off:* Mongoose `.populate()` runs multiple queries under the hood rather than executing database-level JOIN operations.
   - *Rationale:* Highly performant for simple applications and very readable. At scale, this would be replaced with aggregation pipelines or normalized table configurations to reduce DB round-trips.

4. **Optimistic Locking / Validation checks over DB-level Locking:**
   - *Trade-off:* The controller validates `newQty < 0` at execution time after retrieving the product.
   - *Rationale:* Suitable for single-user validation testing. To prevent race conditions at scale (e.g. concurrent transactions draining stock simultaneously below 0), atomic updates like `{ $inc: { quantity: -changeAmount } }` with MongoDB schema assertions (`$gte: 0`) would be integrated.

---

## 🎨 UI & UX Design

- **Collapsible Sidebar:** Fits compact screens cleanly while maximizing desktop visibility.
- **Visual Analytics:** Features clear cards for overall value, product numbers, user count, and total audit updates.
- **Alert Flags:** The Low Stock Alert cards automatically detect quantities under 10, highlighting empty stock in danger-red progress indicators and warning states.
- **Auditing UI:** Ledger history uses indicators (Green Arrow Up `+` / Red Arrow Down `-`) to help administrators scan historical events visually.
