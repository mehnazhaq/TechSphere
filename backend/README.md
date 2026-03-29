# TechSphere Backend API 🚀

A scalable, secure REST API for the TechSphere IT Services & SaaS Management Platform.

## Overview

TechSphere Backend is a complete Express.js + MongoDB solution providing:
- **JWT Authentication** - Token-based user authentication
- **Role-Based Access Control** - Admin, Client, and User roles
- **CRUD Operations** - Full management of clients, services, and support tickets
- **Input Validation** - Express-validator for data integrity
- **Error Handling** - Centralized error management
- **Database Indexing** - Optimized MongoDB queries

## Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 24.x | Runtime environment |
| Express.js | 4.18 | Web framework |
| MongoDB | Cloud | Database |
| Mongoose | 8.0 | ODM/Schema validation |
| JWT | 9.1 | Authentication |
| bcryptjs | 2.4 | Password hashing |
| CORS | 2.8 | Cross-origin requests |

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js      # MongoDB connection
│   │   └── env.js           # Environment variables
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── clientController.js
│   │   ├── serviceController.js
│   │   └── ticketController.js
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT verification
│   │   ├── roleMiddleware.js    # Role-based access
│   │   ├── validation.js        # Input validation
│   │   └── errorHandler.js      # Error handling
│   ├── models/
│   │   ├── User.js
│   │   ├── Client.js
│   │   ├── Service.js
│   │   └── Ticket.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── clientRoutes.js
│   │   ├── serviceRoutes.js
│   │   └── ticketRoutes.js
│   └── index.js             # Server entry point
├── .env                     # Environment variables
├── .env.example             # Template
├── .gitignore
├── package.json
└── README.md
```

## Installation

### Prerequisites
- Node.js 24.x or higher
- npm 10.x or higher
- MongoDB Atlas account

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd techsphere/backend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Environment Setup
```bash
cp .env.example .env
```

### Step 4: Configure MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Update `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/techsphere?retryWrites=true&w=majority
JWT_SECRET=your_secure_secret_key_here
```

### Step 5: Start Development Server
```bash
npm run dev
```

Expected output:
```
✅ Server running on http://localhost:5000
✅ MongoDB Connected: ...
📝 Frontend URL: http://localhost:5173
```

## API Endpoints

### Authentication (`/api/auth`)

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass@123",
  "role": "Client"
}

Response: 201 Created
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Client"
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass@123"
}

Response: 200 OK
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "Client"
    }
  }
}
```

#### Get Profile (Protected)
```http
GET /api/auth/profile
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "message": "Profile fetched successfully",
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Client",
    "createdAt": "2024-03-29T10:00:00Z",
    "updatedAt": "2024-03-29T10:00:00Z"
  }
}
```

---

### Client Management (`/api/clients`)

#### Create Client (Admin only)
```http
POST /api/clients
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Acme Corp",
  "company": "Acme Corporation",
  "email": "contact@acme.com",
  "contact": "+1-555-0100",
  "planType": "Professional",
  "subscriptionStatus": "Active",
  "address": "123 Business St",
  "city": "New York",
  "country": "USA"
}

Response: 201 Created
```

#### Get All Clients
```http
GET /api/clients
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "message": "Clients fetched successfully",
  "data": [ /* array of clients */ ]
}
```

#### Get Client by ID
```http
GET /api/clients/:id
Authorization: Bearer <token>
```

#### Update Client (Admin only)
```http
PUT /api/clients/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "planType": "Enterprise",
  "subscriptionStatus": "Active"
}
```

#### Delete Client (Admin only)
```http
DELETE /api/clients/:id
Authorization: Bearer <admin_token>
```

---

### Service Management (`/api/services`)

#### Create Service (Admin only)
```http
POST /api/services
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Cloud Migration",
  "description": "Complete infrastructure migration to cloud",
  "pricing": 5000,
  "activeStatus": true,
  "category": "Cloud"
}
```

#### Get All Services
```http
GET /api/services
Authorization: Bearer <token>
```

#### Get Service by ID
```http
GET /api/services/:id
Authorization: Bearer <token>
```

#### Update Service (Admin only)
```http
PUT /api/services/:id
Authorization: Bearer <admin_token>
Content-Type: application/json
```

#### Delete Service (Admin only)
```http
DELETE /api/services/:id
Authorization: Bearer <admin_token>
```

---

### Ticket Management (`/api/tickets`)

#### Create Ticket (Client)
```http
POST /api/tickets
Authorization: Bearer <client_token>
Content-Type: application/json

{
  "title": "Server Down",
  "description": "Production server is not responding",
  "clientId": "...",
  "priority": "High"
}
```

#### Get All Tickets (Admin only)
```http
GET /api/tickets
Authorization: Bearer <admin_token>
```

#### Get User's Tickets
```http
GET /api/tickets/user/my-tickets
Authorization: Bearer <token>
```

#### Get Ticket by ID
```http
GET /api/tickets/:id
Authorization: Bearer <token>
```

#### Update Ticket Status (Admin only)
```http
PUT /api/tickets/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "In Progress",
  "assignedTo": "admin_user_id",
  "priority": "High"
}
```

#### Delete Ticket (Admin only)
```http
DELETE /api/tickets/:id
Authorization: Bearer <admin_token>
```

---

## Authentication & Authorization

### JWT Flow

1. User submits credentials to POST `/api/auth/login`
2. Server validates credentials against MongoDB
3. Server generates JWT token with userId, email, and role
4. Client stores token in localStorage
5. Client includes token in Authorization header: `Bearer <token>`
6. Server middleware verifies token signature and expiration
7. Request proceeds to protected endpoint

### Token Structure

```
Header.Payload.Signature

Header: {"alg": "HS256", "typ": "JWT"}
Payload: {
  "userId": "...",
  "email": "user@example.com",
  "role": "Client",
  "iat": 1234567890,
  "exp": 1234654290
}
```

### Role-Based Access Control (RBAC)

| Feature | Admin | Client | User |
|---------|:-----:|:------:|:----:|
| Create Clients | ✅ | ❌ | ❌ |
| Edit Services | ✅ | ❌ | ❌ |
| Create Tickets | ✅ | ✅ | ✅ |
| View All Tickets | ✅ | ❌ | ❌ |
| Update Ticket Status | ✅ | ❌ | ❌ |

---

## Database Models

### User Schema
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique, indexed),
  passwordHash: String (required, hashed with bcryptjs),
  role: Enum ['Admin', 'Client', 'User'],
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Client Schema
```javascript
{
  _id: ObjectId,
  name: String (required),
  company: String (required),
  email: String (required, unique),
  contact: String (required),
  planType: Enum ['Starter', 'Professional', 'Enterprise'],
  subscriptionStatus: Enum ['Active', 'Inactive', 'Suspended'],
  address: String,
  city: String,
  country: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Service Schema
```javascript
{
  _id: ObjectId,
  name: String (required),
  description: String (required),
  pricing: Number (required, min: 0),
  activeStatus: Boolean (default: true),
  category: Enum [...],
  createdBy: ObjectId (reference to User),
  updatedBy: ObjectId (reference to User),
  createdAt: Date,
  updatedAt: Date
}
```

### Ticket Schema
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String (required),
  userId: ObjectId (reference to User, required),
  clientId: ObjectId (reference to Client),
  status: Enum ['Open', 'In Progress', 'Resolved', 'Closed'],
  priority: Enum ['Low', 'Medium', 'High'],
  assignedTo: ObjectId (reference to User),
  attachments: [String],
  createdAt: Date,
  updatedAt: Date,
  resolvedAt: Date,
  closedAt: Date
}
```

---

## Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400,
  "errors": [] // Optional: validation errors
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Server Error

---

## Testing with Postman

### 1. Create Postman Collection
- New Collection: "TechSphere API"
- Set Base URL: `http://localhost:5000/api`

### 2. Test Authentication
- Register new user
- Login to get token
- Copy token for other requests

### 3. Set Authorization Header
In Postman, go to Headers tab:
```
Authorization: Bearer <your_token_here>
```

### 4. Test Each Endpoint
- Create resources (POST)
- Read resources (GET)
- Update resources (PUT)
- Delete resources (DELETE)

---

## Security Best Practices

✅ **Implemented:**
- JWT token-based authentication
- Password hashing with bcryptjs
- Role-based access control
- Input validation with express-validator
- CORS configuration
- HTTP-only token storage (recommended)

✅ **Additional Recommendations:**
- Use HTTPS in production
- Store JWT_SECRET in secure environment
- Implement rate limiting
- Add request logging
- Use environment variables for secrets
- Regular security audits

---

## Troubleshooting

### MongoDB Connection Error
```
Error: MongoNetworkError: connect ECONNREFUSED
```
**Solution:**
- Verify MongoDB URI in `.env`
- Check IP whitelist in MongoDB Atlas
- Ensure network connectivity

### JWT Token Expired
```
Error: JsonWebTokenError: jwt expired
```
**Solution:**
- Login again to get new token
- Implement token refresh mechanism

### CORS Error
```
Error: Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
- Verify FRONTEND_URL in `.env`
- Check CORS middleware configuration
- Restart server after changes

---

## Deployment

### Heroku Deployment
```bash
# Login
heroku login

# Create app
heroku create techsphere-api

# Set environment variables
heroku config:set MONGODB_URI=<uri>
heroku config:set JWT_SECRET=<secret>

# Deploy
git push heroku main
```

### Environment Variables Production
```
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/techsphere
JWT_SECRET=<strong-random-string>
JWT_EXPIRE=7d
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://yourdomain.com
```

---

## Scripts

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start

# Build
npm run build
```

---

## API Response Format

All responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation description",
  "statusCode": 200,
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400,
  "errors": [] // Optional
}
```

---

## Frontend Integration

### Setup API Base URL
```javascript
// In your frontend config
const API_BASE_URL = 'http://localhost:5000/api';

// Or use environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

### Making API Requests
```javascript
// Example: Login
const response = await fetch(`${API_BASE_URL}/auth/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password',
  }),
});

const data = await response.json();
// Store token
localStorage.setItem('token', data.data.token);
```

### Authenticated Requests
```javascript
// Example: Get user profile
const response = await fetch(`${API_BASE_URL}/auth/profile`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
  },
});
```

---

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT.io - JWT Token Decoder](https://jwt.io/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [REST API Best Practices](https://restfulapi.net/)

---

## Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and test
3. Commit: `git commit -m 'feat: your feature'`
4. Push: `git push origin feature/your-feature`
5. Create Pull Request

---

## License

MIT License - See LICENSE file for details

---

## Support

For issues, feature requests, or questions:
- Create GitHub Issue
- Contact: support@techsphere.com
- Documentation: See BACKEND_SETUP_PLAN.md

---

**Backend Version:** 1.0.0  
**Last Updated:** March 29, 2026  
**Status:** Production Ready ✅

