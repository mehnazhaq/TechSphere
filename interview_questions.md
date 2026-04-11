# TechSphere Project: Interview Preparation Guide

This document contains potential interview questions based on the technologies and architecture used in the TechSphere project (MERN Stack: MongoDB, Express.js, React, Node.js + TypeScript & Tailwind CSS).

## 1. React & Frontend Questions

### Q1: What is the purpose of `useState` and `useEffect` in this project?
**Answer:** 
- `useState` is used to manage local component state, like form inputs in the `LoginPage` or the list of clients fetched from the backend in the `Clients` component.
- `useEffect` is used to handle side effects, such as fetching data from the backend API when the component first loads (e.g., calling `fetchUsers` when the Clients page mounts).

### Q2: Why did you use `React.FC` in your components?
**Answer:** `React.FC` stands for React Functional Component. Since the project uses TypeScript, using `React.FC` explicitly types the function as a component. It provides better type-checking for props and ensures the component returns valid JSX.

### Q3: How is routing handled in the frontend?
**Answer:** Routing is managed by `react-router-dom`. It allows the application to be a Single Page Application (SPA), meaning we can navigate between pages (like Login, Dashboard, Clients) without reloading the entire browser page.

### Q4: How are you managing styles in this project?
**Answer:** The project uses **Tailwind CSS**, a utility-first CSS framework. Instead of writing custom CSS files, we use predefined utility classes directly inside our JSX components (e.g., `className="flex justify-between items-center bg-blue-500"`). This accelerates development and keeps styles scoped to components.

---

## 2. Backend & Node.js/Express Questions

### Q5: Can you explain the folder structure of your Express backend?
**Answer:** The backend follows the MVC (Model-View-Controller) pattern, adapted for APIs:
- **`models/`**: Defines the MongoDB schemas using Mongoose (e.g., User, Client, Ticket).
- **`routes/`**: Maps API endpoints to specific functions (e.g., `/api/clients` routes).
- **`middleware/`**: Contains reusable functions that run before a route handler, like JWT authentication (`auth.js`) and error handling (`error.js`).
- **`server.js`**: The main entry point that configures the Express app, connects to the database, and mounts middleware and routes.

### Q6: How do you handle errors in your Express application?
**Answer:** We implemented a centralized error-handling middleware. Instead of writing repetitive `try-catch` blocks that send manual error responses, we pass errors to Express's `next(err)` function. The custom error handler (`middleware/error.js`) catches Mongoose validation errors, duplicate key errors, and JWT issues, formatting them into a standard JSON response.

### Q7: How does Cross-Origin Resource Sharing (CORS) work in your app?
**Answer:** Because the React frontend (running on port 5173) and the Node.js backend (running on port 5000) are on different origins, the browser blocks requests between them by default for security. We use the `cors` middleware in Express to explicitly allow the frontend URL to communicate with the backend.

---

## 3. Database (MongoDB & Mongoose) Questions

### Q8: Why did you choose MongoDB over a SQL database?
**Answer:** MongoDB is a NoSQL, document-oriented database. It aligns well with JavaScript/Node.js because data is stored in JSON-like format (BSON). For a SaaS platform like TechSphere where features and schemas might evolve rapidly without complex joins, MongoDB provides flexibility and scalability.

### Q9: What is Mongoose and what benefits does it bring?
**Answer:** Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It provides a schema-based solution to model application data. It adds validation, data casting, and query-building features that base MongoDB doesn't have by default.

---

## 4. Authentication & Security Questions

### Q10: How does authentication work in this project?
**Answer:** The project uses **JSON Web Tokens (JWT)**.
1. The user sends their email and password to the `/api/auth/login` endpoint.
2. The backend verifies the credentials matching the hashed password in the database.
3. If successful, the backend generates a signed JWT and sends it back to the client.
4. The React frontend stores this token in `localStorage`.
5. For protected routes (like viewing clients), the frontend attaches the token to the `Authorization` header as a `Bearer` token string.
6. The backend's `protect` middleware verifies the token before allowing access to the route.

### Q11: How is Role-Based Access Control (RBAC) implemented?
**Answer:** We created an `authorize` middleware function. After the `protect` middleware verifies the JWT and attaches the user to the request object (`req.user`), the `authorize` middleware checks if `req.user.role` (e.g., Admin, Technician, Client) is included in the array of allowed roles for that specific route. If not, it returns a 403 Forbidden error.

### Q12: How are passwords stored in the database?
**Answer:** Passwords are never stored as plain text. We use the `bcryptjs` library. Before a new User model is saved to MongoDB, a Mongoose `pre-save` hook generates a random salt and hashes the password. When checking a login, we use `bcrypt.compare` to check if the entered password matches the stored hash.
