# TechSphere Backend Setup Plan 🚀

## Project Overview
TechSphere is an **IT Services & SaaS Management Platform** built with a modern tech stack. This document outlines the complete backend setup using Node.js, Express.js, MongoDB, and JWT authentication.

---

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Phase-by-Phase Implementation](#phase-by-phase-implementation)
5. [API Endpoints](#api-endpoints)
6. [Database Schema](#database-schema)
7. [Authentication & Authorization](#authentication--authorization)
8. [Setup Instructions](#setup-instructions)
9. [Testing Guide](#testing-guide)

---

## Architecture Overview

```
┌─────────────────┐
│  React Frontend │ (http://localhost:5173)
│   (Vite)        │
└────────┬────────┘
         │ HTTP/REST
         ▼
┌─────────────────────────────────────┐
│   Express.js Backend API            │
│   (http://localhost:5000)          │
├─────────────────────────────────────┤
│  • Authentication (JWT)             │
│  • Role-Based Access Control        │
│  • CRUD Operations                  │
│  • Error Handling                   │
│  • Input Validation                 │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│   MongoDB Atlas (Cloud Database)    │
├─────────────────────────────────────┤
│  ├─ Users Collection               │
│  ├─ Clients Collection             │
│  ├─ Services Collection            │
│  └─ Tickets Collection             │
└─────────────────────────────────────┘
```

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Runtime** | Node.js 24.x | JavaScript runtime |
| **Framework** | Express.js 4.18 | Web framework for APIs |
| **Database** | MongoDB Atlas | Cloud NoSQL database |
| **ODM** | Mongoose 8.0 | MongoDB object modeling |
| **Authentication** | JWT (jsonwebtoken) | Secure token-based auth |
| **Password Hashing** | bcryptjs | Secure password encryption |
| **Validation** | express-validator | Input validation |
| **CORS** | cors | Cross-origin requests |
| **Environment** | dotenv | Environment variables |
| **Dev Tool** | nodemon | Auto-restart on changes |

---

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   └── env.js               # Environment variables
│   ├── models/
│   │   ├── User.js              # User schema & model
│   │   ├── Client.js            # Client schema & model
│   │   ├── Service.js           # Service schema & model
│   │   └── Ticket.js            # Ticket schema & model
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── clientController.js  # Client CRUD operations
│   │   ├── serviceController.js # Service CRUD operations
│   │   └── ticketController.js  # Ticket CRUD operations
│   ├── routes/
│   │   ├── authRoutes.js        # /auth endpoints
│   │   ├── clientRoutes.js      # /clients endpoints
│   │   ├── serviceRoutes.js     # /services endpoints
│   │   └── ticketRoutes.js      # /tickets endpoints
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT verification
│   │   ├── roleMiddleware.js    # Role-based access
│   │   ├── validation.js        # Input validation
│   │   └── errorHandler.js      # Error handling
│   └── index.js                 # Server entry point
├── .env.example                 # Environment template
├── .env                         # Environment variables (local)
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies & scripts
└── README.md                    # Backend documentation
```

---

## Phase-by-Phase Implementation

### Phase 1: Project Initialization ✅

**Tasks:**
- Create `/backend` directory
- Initialize Node.js project with `package.json`
- Install all dependencies
- Create `.env` configuration file
- Set up `.gitignore`

**Dependencies to install:**
```bash
npm install express mongoose jsonwebtoken bcryptjs cors express-validator dotenv
npm install --save-dev nodemon
```

**Key files:**
- `backend/package.json` - Project metadata & dependencies
- `backend/.env` - Configuration (MongoDB URI, JWT secret)
- `backend/.env.example` - Template for environment variables

---

### Phase 2: Server & Database Setup

**Files to create:**

**`src/config/database.js`**
```javascript
// MongoDB connection setup using Mongoose
// Handles connection errors and logging
```

**`src/config/env.js`**
```javascript
// Load and validate environment variables
// Provide default values where needed
```

**`src/index.js`** (Main Server File)
```javascript
// Express app initialization
// Middleware setup (CORS, JSON parser)
// Route registration
// Error handling middleware
// Server listening on PORT
```

**Middleware to add:**
- CORS for frontend communication
- JSON body parser
- Request logging
- Error handling (catch-all)

---

### Phase 3: Mongoose Models

Create database schemas and models:

#### **User Model**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, indexed),
  passwordHash: String,
  role: Enum ['Admin', 'Client', 'User'],
  createdAt: Date,
  updatedAt: Date
}
```

#### **Client Model**
```javascript
{
  _id: ObjectId,
  name: String,
  company: String,
  email: String,
  contact: String,
  planType: Enum ['Starter', 'Professional', 'Enterprise'],
  subscriptionStatus: Enum ['Active', 'Inactive', 'Suspended'],
  createdAt: Date,
  updatedAt: Date
}
```

#### **Service Model**
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  pricing: Number,
  activeStatus: Boolean,
  createdBy: ObjectId (reference to User),
  createdAt: Date,
  updatedAt: Date
}
```

#### **Ticket Model**
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  userId: ObjectId (reference to User),
  status: Enum ['Open', 'In Progress', 'Resolved', 'Closed'],
  priority: Enum ['Low', 'Medium', 'High'],
  createdAt: Date,
  updatedAt: Date,
  resolvedAt: Date
}
```

---

### Phase 4: Authentication System

**Components:**

#### **JWT Middleware** (`src/middleware/authMiddleware.js`)
```javascript
// Verify JWT token from request headers
// Extract user ID and attach to request
// Handle expired/invalid tokens
```

**Middleware pattern:**
```
1. Extract token from Authorization header
2. Verify token signature and expiration
3. Decode token to get userId
4. Attach user to req object
5. Pass to next middleware/route
```

#### **Role-Based Middleware** (`src/middleware/roleMiddleware.js`)
```javascript
// Roles: Admin, Client, User
// Admin: Full access to all routes
// Client: Limited access (view own data, submit tickets)
// User: Read-only access
```

#### **Auth Controller** (`src/controllers/authController.js`)

**Register endpoint:**
```javascript
// POST /auth/register
// Input: { name, email, password, role }
// 1. Validate input (email format, password strength)
// 2. Check if user already exists
// 3. Hash password using bcryptjs
// 4. Create user in database
// 5. Return success message
```

**Login endpoint:**
```javascript
// POST /auth/login
// Input: { email, password }
// 1. Find user by email
// 2. Compare password with hash
// 3. If match: Generate JWT token
// 4. Return token and user info
// 5. If no match: Return error
```

**Get Profile endpoint:**
```javascript
// GET /auth/profile (Protected)
// 1. Verify JWT token
// 2. Fetch user details from database
// 3. Return user info (exclude passwordHash)
```

---

### Phase 5: API Routes & Controllers

All routes follow RESTful conventions:

#### **Client Management Routes**

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/clients` | ✅ | Admin | Create new client |
| GET | `/clients` | ✅ | Any | List all clients |
| GET | `/clients/:id` | ✅ | Any | Get client by ID |
| PUT | `/clients/:id` | ✅ | Admin | Update client |
| DELETE | `/clients/:id` | ✅ | Admin | Delete client |

#### **Service Management Routes**

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/services` | ✅ | Admin | Create new service |
| GET | `/services` | ✅ | Any | List all services |
| GET | `/services/:id` | ✅ | Any | Get service by ID |
| PUT | `/services/:id` | ✅ | Admin | Update service |
| DELETE | `/services/:id` | ✅ | Admin | Delete service |

#### **Ticket Management Routes**

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/tickets` | ✅ | Client | Create ticket |
| GET | `/tickets` | ✅ | Admin | List all tickets |
| GET | `/tickets/:id` | ✅ | Any | Get ticket by ID |
| PUT | `/tickets/:id` | ✅ | Admin | Update ticket |
| DELETE | `/tickets/:id` | ✅ | Admin | Delete ticket |

---

### Phase 6: Middleware & Utilities

#### **Input Validation Middleware**
```javascript
// Validate required fields
// Check data types
// Validate email format
// Check password strength
// Return 400 if validation fails
```

#### **Error Handling Middleware**
```javascript
// Centralized error handling
// Format error responses consistently
// Log errors for debugging
// Return appropriate HTTP status codes
```

**Error Response Format:**
```javascript
{
  success: false,
  message: "Error description",
  statusCode: 400,
  data: null
}
```

**Success Response Format:**
```javascript
{
  success: true,
  message: "Operation successful",
  statusCode: 200,
  data: { /* result */ }
}
```

---

### Phase 7: Configuration & Environment

**`.env` file template:**
```
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/techsphere

# JWT Configuration
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

**Environment Setup:**
1. Copy `.env.example` to `.env`
2. Update MongoDB Atlas connection string
3. Set JWT_SECRET to a secure random string
4. Configure FRONTEND_URL for CORS

---

### Phase 8: Documentation

Create comprehensive README with:
- Project overview
- Tech stack details
- Installation instructions
- API endpoint documentation
- Authentication flow
- Example requests/responses
- Deployment guide

---

### Phase 9: Testing & Integration

**Testing checklist:**
- [ ] Start backend server (`npm run dev`)
- [ ] Test all authentication endpoints (register, login, profile)
- [ ] Verify JWT token functionality
- [ ] Test role-based access control
- [ ] Test all CRUD operations for each resource
- [ ] Verify error handling
- [ ] Test input validation
- [ ] Verify frontend ↔ backend communication
- [ ] Check CORS configuration
- [ ] Test with Postman collection

---

## API Endpoints

### Authentication Endpoints

**Register User**
```
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password@123",
  "role": "Client"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4a1a",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Client"
  }
}
```

**Login User**
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password@123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "60d5ec49f1b2c72b8c8e4a1a",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "Client"
    }
  }
}
```

**Get Profile**
```
GET /auth/profile
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Profile fetched successfully",
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4a1a",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Client",
    "createdAt": "2024-03-29T10:00:00Z"
  }
}
```

---

### Client Management Endpoints

**Create Client (Admin only)**
```
POST /clients
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Acme Corp",
  "company": "Acme Corporation",
  "email": "contact@acme.com",
  "contact": "+1-555-0100",
  "planType": "Professional",
  "subscriptionStatus": "Active"
}

Response:
{
  "success": true,
  "message": "Client created successfully",
  "data": { /* client object */ }
}
```

**Get All Clients**
```
GET /clients
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Clients fetched successfully",
  "data": [ /* array of clients */ ]
}
```

**Get Single Client**
```
GET /clients/:id
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Client fetched successfully",
  "data": { /* client object */ }
}
```

**Update Client (Admin only)**
```
PUT /clients/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "planType": "Enterprise",
  "subscriptionStatus": "Active"
}

Response:
{
  "success": true,
  "message": "Client updated successfully",
  "data": { /* updated client */ }
}
```

**Delete Client (Admin only)**
```
DELETE /clients/:id
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "message": "Client deleted successfully"
}
```

---

### Service Management Endpoints

**Create Service (Admin only)**
```
POST /services
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Cloud Migration",
  "description": "Migrate infrastructure to cloud",
  "pricing": 5000,
  "activeStatus": true
}

Response:
{
  "success": true,
  "message": "Service created successfully",
  "data": { /* service object */ }
}
```

**Get All Services**
```
GET /services
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Services fetched successfully",
  "data": [ /* array of services */ ]
}
```

**Similar endpoints for GET /:id, PUT /:id, DELETE /:id**

---

### Ticket Management Endpoints

**Create Ticket (Clients)**
```
POST /tickets
Authorization: Bearer <client_token>
Content-Type: application/json

{
  "title": "Server Down",
  "description": "Production server is not responding",
  "priority": "High"
}

Response:
{
  "success": true,
  "message": "Ticket created successfully",
  "data": { /* ticket object */ }
}
```

**Get All Tickets (Admin)**
```
GET /tickets
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "message": "Tickets fetched successfully",
  "data": [ /* array of tickets */ ]
}
```

**Update Ticket Status (Admin)**
```
PUT /tickets/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "In Progress"
}

Response:
{
  "success": true,
  "message": "Ticket updated successfully",
  "data": { /* updated ticket */ }
}
```

---

## Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique, indexed),
  passwordHash: String (required),
  role: String (enum: ['Admin', 'Client', 'User'], default: 'User'),
  isActive: Boolean (default: true),
  createdAt: Date (default: now),
  updatedAt: Date (default: now)
}

Indexes:
- email (unique)
- role
```

### Client Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  company: String (required),
  email: String (required, unique),
  contact: String (required),
  planType: String (enum: ['Starter', 'Professional', 'Enterprise']),
  subscriptionStatus: String (enum: ['Active', 'Inactive', 'Suspended']),
  address: String,
  city: String,
  country: String,
  createdAt: Date (default: now),
  updatedAt: Date (default: now)
}

Indexes:
- email (unique)
- company
- subscriptionStatus
```

### Service Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  description: String (required),
  pricing: Number (required),
  activeStatus: Boolean (default: true),
  category: String,
  createdBy: ObjectId (reference to User),
  updatedBy: ObjectId (reference to User),
  createdAt: Date (default: now),
  updatedAt: Date (default: now)
}

Indexes:
- name
- activeStatus
- createdBy
```

### Ticket Collection
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String (required),
  userId: ObjectId (reference to User, required),
  clientId: ObjectId (reference to Client),
  status: String (enum: ['Open', 'In Progress', 'Resolved', 'Closed'], default: 'Open'),
  priority: String (enum: ['Low', 'Medium', 'High'], default: 'Medium'),
  assignedTo: ObjectId (reference to User),
  attachments: [String],
  createdAt: Date (default: now),
  updatedAt: Date (default: now),
  resolvedAt: Date,
  closedAt: Date
}

Indexes:
- userId
- status
- priority
- createdAt (descending)
```

---

## Authentication & Authorization

### JWT Flow

```
1. User submits email & password
         ↓
2. Backend validates credentials
         ↓
3. Password matches → Generate JWT token
         ↓
4. Return token to frontend
         ↓
5. Frontend stores token in localStorage/sessionStorage
         ↓
6. Frontend includes token in Authorization header
         ↓
7. Backend middleware verifies token
         ↓
8. Access granted to protected resource
```

### JWT Token Structure

```
Header.Payload.Signature

Header: { "alg": "HS256", "typ": "JWT" }
Payload: { "userId": "...", "email": "...", "role": "...", "iat": ..., "exp": ... }
Signature: HMAC-SHA256(header + payload, secret)
```

### Role-Based Access Control (RBAC)

| Feature | Admin | Client | User |
|---------|-------|--------|------|
| Manage Users | ✅ | ❌ | ❌ |
| Manage Clients | ✅ | ❌ | ❌ |
| Manage Services | ✅ | ❌ | ❌ |
| Create Tickets | ✅ | ✅ | ✅ |
| View All Tickets | ✅ | ❌ | ❌ |
| Update Ticket Status | ✅ | ❌ | ❌ |
| Delete Resources | ✅ | ❌ | ❌ |

---

## Setup Instructions

### Prerequisites
- Node.js 24.x or higher
- npm 10.x or higher
- MongoDB Atlas account (free tier available)
- Git (for version control)

### Step 1: Clone Repository
```bash
git clone <repository_url>
cd techsphere
```

### Step 2: Navigate to Backend
```bash
cd backend
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Create Environment File
```bash
cp .env.example .env
```

### Step 5: Configure MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account or login
3. Create a new cluster
4. Get connection string
5. Update `MONGODB_URI` in `.env`

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/techsphere?retryWrites=true&w=majority
```

### Step 6: Set JWT Secret
Generate a secure random string and update `.env`:
```
JWT_SECRET=your_generated_secret_key_here
```

### Step 7: Start Backend Server
```bash
npm run dev
```

Expected output:
```
Server running on http://localhost:5000
Database connected successfully
```

### Step 8: Verify Connection
Make a test request:
```bash
curl http://localhost:5000/health
```

---

## Testing Guide

### Using Postman

1. **Import API Collection** (optional)
   - Create new collection "TechSphere API"
   - Add requests for each endpoint

2. **Test Authentication**
   - Register new user: POST `/auth/register`
   - Login: POST `/auth/login`
   - Copy token from response
   - Set Authorization header for protected routes

3. **Test Client Management**
   - Create client (Admin token): POST `/clients`
   - Get all clients: GET `/clients`
   - Get single client: GET `/clients/:id`
   - Update client: PUT `/clients/:id`
   - Delete client: DELETE `/clients/:id`

4. **Test Services**
   - Similar flow to clients

5. **Test Tickets**
   - Create ticket as Client
   - View ticket as Admin
   - Update status as Admin

### Using cURL

```bash
# Register User
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"Pass@123","role":"Client"}'

# Login
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"Pass@123"}'

# Get Profile (with token)
curl -X GET http://localhost:5000/auth/profile \
  -H "Authorization: Bearer <token>"
```

---

## Common Issues & Solutions

### MongoDB Connection Error
**Error:** `MongoNetworkError: connect ECONNREFUSED`

**Solution:**
- Verify MongoDB URI in `.env`
- Check IP whitelist in MongoDB Atlas
- Ensure network connection is stable

### JWT Token Expired
**Error:** `JsonWebTokenError: jwt expired`

**Solution:**
- Login again to get new token
- Adjust `JWT_EXPIRE` in `.env`
- Implement token refresh mechanism

### CORS Error
**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
- Update `FRONTEND_URL` in `.env`
- Verify CORS middleware configuration
- Check request headers

---

## Deployment

### Deploy to Heroku

```bash
# Login to Heroku
heroku login

# Create app
heroku create techsphere-api

# Set environment variables
heroku config:set MONGODB_URI=<your_mongodb_uri>
heroku config:set JWT_SECRET=<your_jwt_secret>

# Deploy
git push heroku main
```

### Deploy to DigitalOcean / AWS

Detailed deployment guides coming soon...

---

## Git Workflow

```bash
# Clone and setup
git clone <repo>
cd techsphere/backend
npm install

# Create feature branch
git checkout -b feature/auth-implementation

# Make changes and commit
git add .
git commit -m "feat: implement JWT authentication"

# Push and create PR
git push origin feature/auth-implementation
```

---

## Next Steps

After backend setup:
1. ✅ Connect frontend to backend API
2. ✅ Update API endpoints in frontend components
3. ✅ Implement login/logout functionality
4. ✅ Store JWT token in localStorage
5. ✅ Add auth headers to API requests
6. ✅ Test full authentication flow
7. ✅ Deploy to production

---

## Support & Resources

- [Express.js Docs](https://expressjs.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [JWT.io](https://jwt.io/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Node.js Docs](https://nodejs.org/docs/)

---

**Backend Setup Plan Created:** March 29, 2026  
**Version:** 1.0  
**Status:** Ready for Implementation

