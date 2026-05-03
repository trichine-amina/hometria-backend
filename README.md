# DZ-Shop Backend — Mini-Project 2

A complete Node.js / Express / Sequelize / PostgreSQL backend covering all 6 graded criteria.

---

## 📁 Project Structure

```
dz-shop-backend/
├── config/
│   └── database.js          # Sequelize + PostgreSQL connection
├── controllers/
│   ├── authController.js    # Register & Login (JWT)
│   ├── productController.js # CRUD + pagination + filtering + seeding
│   └── orderController.js   # Checkout with inventory check
├── middleware/
│   └── authMiddleware.js    # JWT protect + adminOnly guards
├── models/
│   ├── index.js             # Associations (hasMany, belongsToMany)
│   ├── User.js              # name, email (isEmail), password, role
│   ├── Product.js           # title, price (min:0), category, stock, image
│   ├── Order.js             # totalPrice, status, userId
│   └── OrderItem.js         # Junction table: orderId, productId, quantity
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   └── orderRoutes.js
├── seed.js                  # Seeds 25 products (run: npm run seed)
├── server.js                # Entry point
├── .env                     # Environment variables (edit this!)
└── package.json
```

---

## ⚙️ Setup

### 1. Install dependencies
```bash
cd dz-shop-backend
npm install
```

### 2. Configure your database
Edit `.env` and replace `YOUR_PASSWORD` with your PostgreSQL password:
```
DATABASE_URL=postgres://postgres:YOUR_PASSWORD@localhost:5432/dzshop
JWT_SECRET=dz_shop_super_secret_key_2025
PORT=3000
```
> Make sure you have created a database called `dzshop` in pgAdmin first.

### 3. Start the server
```bash
npm run dev
```
You should see:
```
✅ PostgreSQL connected & tables synced.
🚀 Server running on http://localhost:3000
```

### 4. Seed the database (Criterion 1)
```bash
npm run seed
```
This inserts 25 products across 5 categories (electronics, clothing, books, home, sports).

---

## 🧪 Postman Testing Guide

### ✅ Criterion 1 – Database Seeding
Run `npm run seed` then check pgAdmin. You should see 25 rows in the Products table.

Alternatively, use the hidden seed route (must be logged in as admin):
```
POST /api/products/seed
Authorization: Bearer <admin_token>
Body: [ { "title": "...", "price": 100, "category": "electronics", "stock": 10 } ]
```

---

### ✅ Criterion 2 – Many-to-Many (OrderItems)
First, register and login. Then create an order with multiple items:
```
POST /api/orders
Authorization: Bearer <user_token>
Body:
{
  "userId": 1,
  "items": [
    { "productId": 1, "quantity": 2 },
    { "productId": 3, "quantity": 1 }
  ]
}
```
Check pgAdmin → OrderItems table should have 2 rows linked to the new order.

---

### ✅ Criterion 3 – Pagination & Filtering
```
GET /api/products?page=1&limit=5
GET /api/products?page=2&limit=5
GET /api/products?category=electronics
GET /api/products?page=1&limit=10&category=books
```
Response includes `total`, `page`, `limit`, `totalPages`, and `products`.

---

### ✅ Criterion 4 – JWT Authentication

**Register:**
```
POST /api/auth/register
Body: { "name": "Admin", "email": "admin@dz.com", "password": "123456", "role": "admin" }
```

**Login:**
```
POST /api/auth/login
Body: { "email": "admin@dz.com", "password": "123456" }
```
Copy the `token` from the response.

**Test 401 – no token:**
```
POST /api/products
(no Authorization header)
→ 401 Unauthorized: No token provided.
```

**Test with token:**
```
POST /api/products
Authorization: Bearer <token>
Body: { "title": "New Product", "price": 500, "category": "electronics", "stock": 10 }
→ 201 Created
```

---

### ✅ Criterion 5 – Inventory Management

**Check stock decreases after order:**
1. Note stock of product #1 before ordering
2. Create an order with `{ "productId": 1, "quantity": 2 }`
3. Refresh pgAdmin → stock should decrease by 2

**Test out-of-stock:**
```
POST /api/orders
Body: { "userId": 1, "items": [{ "productId": 1, "quantity": 99999 }] }
→ 400 Bad Request: Out of Stock: "Laptop HP 15" only has X unit(s) left.
```

---

### ✅ Criterion 6 – Data Validation

**Negative price → rejected:**
```
POST /api/products
Authorization: Bearer <admin_token>
Body: { "title": "Bad Product", "price": -50, "category": "test", "stock": 5 }
→ 400: ["Price cannot be negative."]
```

**Invalid email → rejected:**
```
POST /api/auth/register
Body: { "name": "Test", "email": "not-an-email", "password": "123" }
→ 400: ["Please provide a valid email address."]
```

---

## 📋 API Reference

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET    | /health | None | Health check |
| POST   | /api/auth/register | None | Register user |
| POST   | /api/auth/login | None | Login & get token |
| GET    | /api/products | None | List products (paginated + filtered) |
| GET    | /api/products/:id | None | Get single product |
| POST   | /api/products | Admin | Create product |
| PUT    | /api/products/:id | Admin | Update product |
| DELETE | /api/products/:id | Admin | Delete product |
| POST   | /api/products/seed | Admin | Bulk seed products |
| POST   | /api/orders | User | Create order |
| GET    | /api/orders | User/Admin | List orders |
| GET    | /api/orders/:id | User/Admin | Get single order |
