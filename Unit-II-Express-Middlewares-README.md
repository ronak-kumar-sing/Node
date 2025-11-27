# Unit II: Creating Middlewares in Express.js

## Table of Contents
1. [What is Middleware?](#what-is-middleware)
2. [How Middleware Works](#how-middleware-works)
3. [Types of Middleware](#types-of-middleware)
4. [Application-Level Middleware](#application-level-middleware)
5. [Router-Level Middleware](#router-level-middleware)
6. [Built-in Middleware](#built-in-middleware)
7. [Third-Party Middleware](#third-party-middleware)
8. [Error-Handling Middleware](#error-handling-middleware)
9. [app.use() vs app.all()](#appuse-vs-appall)
10. [Cookie and Session Management](#cookie-and-session-management)
11. [Complete Project Examples](#complete-project-examples)
12. [Best Practices](#best-practices)

---

## What is Middleware?

**Middleware** is any function in Express.js that has access to:
- `req` (request object)
- `res` (response object)
- `next()` (function to pass control to the next middleware)

### Basic Structure:
```javascript
function middlewareName(req, res, next) {
    // Execute some logic
    // Modify req or res if needed
    next(); // Pass control to next middleware
}
```

### Visual Flow:
```
Request → Middleware 1 → Middleware 2 → Middleware 3 → Route Handler → Response
```

---

## How Middleware Works

### Example: Request Lifecycle
```javascript
const express = require('express');
const app = express();

// Middleware 1: Logger
app.use((req, res, next) => {
    console.log('1. Logger Middleware');
    next();
});

// Middleware 2: Request Time
app.use((req, res, next) => {
    console.log('2. Time Middleware');
    req.requestTime = new Date().toISOString();
    next();
});

// Middleware 3: Authentication
app.use((req, res, next) => {
    console.log('3. Auth Middleware');
    req.isAuthenticated = true;
    next();
});

// Route Handler
app.get('/', (req, res) => {
    console.log('4. Route Handler');
    res.json({
        message: 'Hello World',
        requestTime: req.requestTime,
        isAuthenticated: req.isAuthenticated
    });
});

app.listen(3000);
```

**Output when you visit http://localhost:3000:**
```
1. Logger Middleware
2. Time Middleware
3. Auth Middleware
4. Route Handler
```

---

## Types of Middleware

| Type | Description | Example |
|------|-------------|---------|
| **Application-Level** | Applied to entire app | `app.use()` |
| **Router-Level** | Applied to specific router | `router.use()` |
| **Built-in** | Provided by Express | `express.json()` |
| **Third-Party** | External packages | `cookie-parser` |
| **Error-Handling** | Handles errors | Has 4 parameters |

---

## Application-Level Middleware

Applied to the entire application using `app.use()`.

### Example 1: Logger Middleware
```javascript
const express = require('express');
const app = express();

// Logger middleware - runs for every request
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.get('/', (req, res) => {
    res.send('Home Page');
});

app.get('/about', (req, res) => {
    res.send('About Page');
});

app.listen(3000);
```

### Example 2: Request Timer Middleware
```javascript
app.use((req, res, next) => {
    req.startTime = Date.now();

    // Override res.send to calculate time
    const originalSend = res.send;
    res.send = function(data) {
        const duration = Date.now() - req.startTime;
        console.log(`Request took ${duration}ms`);
        originalSend.call(this, data);
    };

    next();
});
```

### Example 3: Authentication Middleware
```javascript
// Simple authentication checker
const authenticate = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    if (token === 'secret-token-123') {
        req.user = { id: 1, name: 'Ronak' };
        next();
    } else {
        return res.status(403).json({ error: 'Invalid token' });
    }
};

// Apply to all routes starting with /api
app.use('/api', authenticate);

app.get('/api/profile', (req, res) => {
    res.json({ user: req.user });
});
```

### Example 4: IP Blocker Middleware
```javascript
const blockedIPs = ['192.168.1.100', '10.0.0.50'];

app.use((req, res, next) => {
    const clientIP = req.ip;

    if (blockedIPs.includes(clientIP)) {
        return res.status(403).send('Your IP is blocked');
    }

    next();
});
```

### Example 5: Request Counter Middleware
```javascript
let requestCount = 0;

app.use((req, res, next) => {
    requestCount++;
    console.log(`Total requests: ${requestCount}`);
    next();
});

app.get('/stats', (req, res) => {
    res.json({ totalRequests: requestCount });
});
```

---

## Router-Level Middleware

Applied to specific router instances using `router.use()`.

### Example: Admin Router with Middleware
```javascript
const express = require('express');
const app = express();
const adminRouter = express.Router();

// Router-level middleware
adminRouter.use((req, res, next) => {
    console.log('Admin route accessed');
    console.log(`IP: ${req.ip}`);
    next();
});

// Admin authentication middleware
adminRouter.use((req, res, next) => {
    const isAdmin = req.headers['x-admin'] === 'true';

    if (!isAdmin) {
        return res.status(403).json({ error: 'Admin access required' });
    }

    next();
});

// Admin routes
adminRouter.get('/dashboard', (req, res) => {
    res.json({ message: 'Admin Dashboard' });
});

adminRouter.get('/users', (req, res) => {
    res.json({ users: ['Ronak', 'Priya', 'Amit'] });
});

// Mount router
app.use('/admin', adminRouter);

app.listen(3000);
```

### Example: API Versioning with Router Middleware
```javascript
const v1Router = express.Router();
const v2Router = express.Router();

// V1 middleware
v1Router.use((req, res, next) => {
    console.log('API v1');
    req.apiVersion = 'v1';
    next();
});

// V2 middleware
v2Router.use((req, res, next) => {
    console.log('API v2');
    req.apiVersion = 'v2';
    next();
});

// V1 routes
v1Router.get('/users', (req, res) => {
    res.json({ version: 'v1', users: ['User1', 'User2'] });
});

// V2 routes (different response format)
v2Router.get('/users', (req, res) => {
    res.json({
        version: 'v2',
        data: { users: ['User1', 'User2'] },
        meta: { count: 2 }
    });
});

app.use('/api/v1', v1Router);
app.use('/api/v2', v2Router);
```

---

## Built-in Middleware

Express provides several built-in middleware functions.

### 1. express.json()
Parses incoming JSON payloads.

```javascript
const express = require('express');
const app = express();

// Parse JSON bodies
app.use(express.json());

app.post('/api/user', (req, res) => {
    console.log(req.body); // Access parsed JSON
    res.json({
        received: req.body,
        message: 'Data received successfully'
    });
});

app.listen(3000);
```

**Test with curl:**
```bash
curl -X POST http://localhost:3000/api/user \
  -H "Content-Type: application/json" \
  -d '{"name":"Ronak","age":21}'
```

### 2. express.urlencoded()
Parses URL-encoded form data.

```javascript
// Parse URL-encoded bodies (form submissions)
app.use(express.urlencoded({ extended: true }));

app.post('/submit-form', (req, res) => {
    console.log(req.body); // Access form data
    res.send(`Hello ${req.body.username}`);
});
```

**HTML Form:**
```html
<form action="/submit-form" method="POST">
    <input type="text" name="username" required>
    <input type="email" name="email" required>
    <button type="submit">Submit</button>
</form>
```

### 3. express.static()
Serves static files.

```javascript
const path = require('path');

// Serve files from 'public' directory
app.use(express.static('public'));

// Serve files with custom path prefix
app.use('/assets', express.static('public'));

// Serve with absolute path
app.use(express.static(path.join(__dirname, 'public')));
```

**Directory Structure:**
```
project/
├── app.js
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── script.js
│   └── images/
│       └── logo.png
```

**Access files:**
- `http://localhost:3000/css/style.css`
- `http://localhost:3000/js/script.js`
- `http://localhost:3000/images/logo.png`

### 4. express.raw() & express.text()
```javascript
// Parse raw body buffer
app.use(express.raw({ type: 'application/octet-stream' }));

// Parse text bodies
app.use(express.text({ type: 'text/plain' }));
```

---

## Third-Party Middleware

### 1. cookie-parser

Parses cookies from the request headers.

**Installation:**
```bash
npm install cookie-parser
```

**Basic Usage:**
```javascript
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

app.use(cookieParser());

// Set cookie
app.get('/set-cookie', (req, res) => {
    res.cookie('username', 'Ronak', {
        maxAge: 900000, // 15 minutes
        httpOnly: true
    });
    res.send('Cookie has been set');
});

// Read cookie
app.get('/get-cookie', (req, res) => {
    const username = req.cookies.username;
    res.send(`Username from cookie: ${username}`);
});

// Read all cookies
app.get('/all-cookies', (req, res) => {
    res.json(req.cookies);
});

// Delete cookie
app.get('/delete-cookie', (req, res) => {
    res.clearCookie('username');
    res.send('Cookie deleted');
});

app.listen(3000);
```

**Advanced Cookie Options:**
```javascript
app.get('/secure-cookie', (req, res) => {
    res.cookie('token', 'abc123xyz', {
        maxAge: 3600000, // 1 hour
        httpOnly: true,  // Cannot access via JavaScript
        secure: true,    // Only over HTTPS
        signed: true,    // Signed cookie
        sameSite: 'strict' // CSRF protection
    });
    res.send('Secure cookie set');
});
```

**Signed Cookies:**
```javascript
// Initialize with secret
app.use(cookieParser('my-secret-key'));

// Set signed cookie
app.get('/set-signed', (req, res) => {
    res.cookie('user', 'Ronak', { signed: true });
    res.send('Signed cookie set');
});

// Read signed cookie
app.get('/get-signed', (req, res) => {
    const user = req.signedCookies.user;
    res.send(`Signed cookie: ${user}`);
});
```

### 2. cookie-session

Stores session data in cookies (client-side).

**Installation:**
```bash
npm install cookie-session
```

**Basic Usage:**
```javascript
const express = require('express');
const cookieSession = require('cookie-session');
const app = express();

app.use(cookieSession({
    name: 'session',
    keys: ['secret-key-1', 'secret-key-2'], // Multiple keys for rotation
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// Login - create session
app.post('/login', (req, res) => {
    req.session.userId = 123;
    req.session.username = 'Ronak';
    req.session.role = 'admin';
    res.json({ message: 'Logged in successfully' });
});

// Access session data
app.get('/profile', (req, res) => {
    if (req.session.userId) {
        res.json({
            userId: req.session.userId,
            username: req.session.username,
            role: req.session.role
        });
    } else {
        res.status(401).json({ error: 'Not logged in' });
    }
});

// Logout - destroy session
app.post('/logout', (req, res) => {
    req.session = null;
    res.json({ message: 'Logged out' });
});

app.listen(3000);
```

**Shopping Cart Example:**
```javascript
app.use(cookieSession({
    name: 'cart',
    keys: ['cart-secret-key'],
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
}));

// Add to cart
app.post('/cart/add', (req, res) => {
    if (!req.session.cart) {
        req.session.cart = [];
    }

    req.session.cart.push({
        id: req.body.productId,
        name: req.body.productName,
        price: req.body.price
    });

    res.json({ cart: req.session.cart });
});

// View cart
app.get('/cart', (req, res) => {
    res.json({ cart: req.session.cart || [] });
});

// Clear cart
app.delete('/cart', (req, res) => {
    req.session.cart = [];
    res.json({ message: 'Cart cleared' });
});
```

### 3. express-session

Stores session data on the server (more secure).

**Installation:**
```bash
npm install express-session
```

**Basic Usage:**
```javascript
const express = require('express');
const session = require('express-session');
const app = express();

app.use(session({
    secret: 'my-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set true in production with HTTPS
        maxAge: 3600000 // 1 hour
    }
}));

// Login
app.post('/login', (req, res) => {
    req.session.userId = 100;
    req.session.username = 'Ronak';
    req.session.isAdmin = true;
    res.json({ message: 'Session created' });
});

// Check session
app.get('/dashboard', (req, res) => {
    if (req.session.userId) {
        res.json({
            message: 'Welcome to dashboard',
            user: {
                id: req.session.userId,
                username: req.session.username,
                isAdmin: req.session.isAdmin
            }
        });
    } else {
        res.status(401).json({ error: 'Please login' });
    }
});

// Logout
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.json({ message: 'Logged out successfully' });
    });
});

app.listen(3000);
```

**Authentication System with Sessions:**
```javascript
const session = require('express-session');

app.use(express.json());
app.use(session({
    secret: 'super-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

// Mock user database
const users = [
    { id: 1, username: 'ronak', password: 'pass123', role: 'admin' },
    { id: 2, username: 'priya', password: 'pass456', role: 'user' }
];

// Authentication middleware
const requireAuth = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.status(401).json({ error: 'Authentication required' });
    }
};

// Admin middleware
const requireAdmin = (req, res, next) => {
    if (req.session.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Admin access required' });
    }
};

// Login route
app.post('/auth/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u =>
        u.username === username && u.password === password
    );

    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create session
    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.role = user.role;

    res.json({
        message: 'Login successful',
        user: { id: user.id, username: user.username, role: user.role }
    });
});

// Protected route
app.get('/auth/profile', requireAuth, (req, res) => {
    res.json({
        userId: req.session.userId,
        username: req.session.username,
        role: req.session.role
    });
});

// Admin-only route
app.get('/admin/users', requireAuth, requireAdmin, (req, res) => {
    res.json({ users: users.map(u => ({ id: u.id, username: u.username })) });
});

// Logout
app.post('/auth/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.clearCookie('connect.sid'); // Clear session cookie
        res.json({ message: 'Logged out' });
    });
});
```

**Session Store (Production):**
```javascript
const session = require('express-session');
const MongoStore = require('connect-mongo');

app.use(session({
    secret: 'my-secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/sessions',
        ttl: 24 * 60 * 60 // 1 day
    })
}));
```

---

## Error-Handling Middleware

Error-handling middleware must have **4 parameters**: `(err, req, res, next)`.

### Basic Error Handler
```javascript
const express = require('express');
const app = express();

app.use(express.json());

// Regular route that throws error
app.get('/error', (req, res, next) => {
    const error = new Error('Something went wrong!');
    error.status = 500;
    next(error); // Pass error to error handler
});

// 404 handler (must be before error handler)
app.use((req, res, next) => {
    const error = new Error('Route not found');
    error.status = 404;
    next(error);
});

// Error-handling middleware (must have 4 parameters)
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(err.status || 500).json({
        error: {
            message: err.message,
            status: err.status || 500,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        }
    });
});

app.listen(3000);
```

### Advanced Error Handling
```javascript
// Custom error class
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Routes with error handling
app.get('/user/:id', asyncHandler(async (req, res, next) => {
    const userId = req.params.id;

    if (!userId) {
        throw new AppError('User ID is required', 400);
    }

    // Simulate database query
    const user = await findUserById(userId);

    if (!user) {
        throw new AppError('User not found', 404);
    }

    res.json(user);
}));

// Validation error
app.post('/register', (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Email and password required', 400));
    }

    // Registration logic...
    res.json({ message: 'User registered' });
});

// Global error handler
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    } else {
        // Production: don't leak error details
        if (err.isOperational) {
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        } else {
            console.error('ERROR:', err);
            res.status(500).json({
                status: 'error',
                message: 'Something went wrong'
            });
        }
    }
});
```

---

## app.use() vs app.all()

### app.use()
- Used to mount middleware functions
- Matches **any HTTP method**
- Matches path **prefix**

```javascript
const express = require('express');
const app = express();

// Matches /admin, /admin/users, /admin/settings, etc.
app.use('/admin', (req, res, next) => {
    console.log('Admin area accessed');
    next();
});

app.get('/admin/dashboard', (req, res) => {
    res.send('Dashboard');
});
```

### app.all()
- Route-specific middleware
- Matches **all HTTP methods**
- Matches **exact path** or pattern

```javascript
// Matches exactly /api/users with any HTTP method
app.all('/api/users', (req, res, next) => {
    console.log(`${req.method} request to /api/users`);
    next();
});

app.get('/api/users', (req, res) => {
    res.json({ users: [] });
});

app.post('/api/users', (req, res) => {
    res.json({ message: 'User created' });
});
```

### Comparison Table

| Feature | app.use() | app.all() |
|---------|-----------|-----------|
| Purpose | Middleware mounting | Route handler for all methods |
| Path matching | Prefix | Exact or pattern |
| HTTP methods | All methods | All methods |
| Use case | Global middleware | Route-specific logic |

### Practical Examples

```javascript
const express = require('express');
const app = express();

// app.use() - Matches prefix
app.use('/api', (req, res, next) => {
    console.log('API middleware');
    next();
});
// Matches: /api, /api/users, /api/posts, etc.

// app.all() - Exact match
app.all('/api/users', (req, res, next) => {
    console.log('User route for all methods');
    next();
});
// Matches only: /api/users (GET, POST, PUT, DELETE, etc.)

// Specific handlers
app.get('/api/users', (req, res) => {
    res.json({ method: 'GET' });
});

app.post('/api/users', (req, res) => {
    res.json({ method: 'POST' });
});

app.listen(3000);
```

---

## Cookie and Session Management

### Complete Authentication System

```javascript
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();

app.use(express.json());
app.use(cookieParser('cookie-secret'));
app.use(session({
    secret: 'session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 } // 1 hour
}));

// Mock database
const users = [
    { id: 1, username: 'ronak', password: 'pass123', preferences: {} }
];

// Remember me functionality with cookies
app.post('/login', (req, res) => {
    const { username, password, rememberMe } = req.body;

    const user = users.find(u =>
        u.username === username && u.password === password
    );

    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create session
    req.session.userId = user.id;
    req.session.username = user.username;

    // Remember me cookie (30 days)
    if (rememberMe) {
        res.cookie('rememberMe', user.id, {
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            httpOnly: true,
            signed: true
        });
    }

    res.json({ message: 'Login successful', user: { id: user.id, username: user.username } });
});

// Auto-login from remember me cookie
app.use((req, res, next) => {
    if (!req.session.userId && req.signedCookies.rememberMe) {
        const userId = req.signedCookies.rememberMe;
        const user = users.find(u => u.id === parseInt(userId));

        if (user) {
            req.session.userId = user.id;
            req.session.username = user.username;
        }
    }
    next();
});

// Save user preferences in cookie
app.post('/preferences', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Not logged in' });
    }

    res.cookie('theme', req.body.theme, { maxAge: 365 * 24 * 60 * 60 * 1000 });
    res.cookie('language', req.body.language, { maxAge: 365 * 24 * 60 * 60 * 1000 });

    res.json({ message: 'Preferences saved' });
});

// Get preferences
app.get('/preferences', (req, res) => {
    res.json({
        theme: req.cookies.theme || 'light',
        language: req.cookies.language || 'en'
    });
});

// Logout
app.post('/logout', (req, res) => {
    req.session.destroy();
    res.clearCookie('rememberMe');
    res.json({ message: 'Logged out' });
});

app.listen(3000);
```

---

## Complete Project Examples

### Example 1: Blog API with Middleware

```javascript
const express = require('express');
const session = require('express-session');
const { body, validationResult } = require('express-validator');
const app = express();

app.use(express.json());
app.use(session({
    secret: 'blog-secret',
    resave: false,
    saveUninitialized: false
}));

// Mock data
const users = [
    { id: 1, username: 'ronak', password: 'pass123', role: 'admin' }
];
const posts = [];
let postIdCounter = 1;

// Logger middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Authentication middleware
const authenticate = (req, res, next) => {
    if (req.session.userId) {
        req.user = users.find(u => u.id === req.session.userId);
        next();
    } else {
        res.status(401).json({ error: 'Authentication required' });
    }
};

// Admin middleware
const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Admin access required' });
    }
};

// Login
app.post('/auth/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.userId = user.id;
    res.json({ message: 'Login successful', user: { id: user.id, username: user.username } });
});

// Create post (authenticated users only)
app.post('/posts',
    authenticate,
    [
        body('title').isLength({ min: 5, max: 100 }),
        body('content').isLength({ min: 10 })
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const newPost = {
            id: postIdCounter++,
            title: req.body.title,
            content: req.body.content,
            author: req.user.username,
            authorId: req.user.id,
            createdAt: new Date()
        };

        posts.push(newPost);
        res.status(201).json(newPost);
    }
);

// Get all posts (public)
app.get('/posts', (req, res) => {
    res.json(posts);
});

// Delete post (admin only)
app.delete('/posts/:id', authenticate, requireAdmin, (req, res) => {
    const index = posts.findIndex(p => p.id === parseInt(req.params.id));

    if (index === -1) {
        return res.status(404).json({ error: 'Post not found' });
    }

    const deleted = posts.splice(index, 1);
    res.json({ message: 'Post deleted', post: deleted[0] });
});

// Logout
app.post('/auth/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logged out' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong' });
});

app.listen(3000, () => {
    console.log('Blog API running on port 3000');
});
```

### Example 2: E-commerce Cart System

```javascript
const express = require('express');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cookieSession({
    name: 'cart-session',
    keys: ['cart-secret-key'],
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
}));

// Mock products
const products = [
    { id: 1, name: 'Laptop', price: 50000, stock: 10 },
    { id: 2, name: 'Mouse', price: 500, stock: 50 },
    { id: 3, name: 'Keyboard', price: 1500, stock: 30 }
];

// Initialize cart middleware
app.use((req, res, next) => {
    if (!req.session.cart) {
        req.session.cart = [];
    }
    next();
});

// View products
app.get('/products', (req, res) => {
    res.json(products);
});

// Add to cart
app.post('/cart/add', (req, res) => {
    const { productId, quantity } = req.body;
    const product = products.find(p => p.id === productId);

    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    if (quantity > product.stock) {
        return res.status(400).json({ error: 'Insufficient stock' });
    }

    const existingItem = req.session.cart.find(item => item.productId === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        req.session.cart.push({
            productId,
            name: product.name,
            price: product.price,
            quantity
        });
    }

    res.json({ message: 'Added to cart', cart: req.session.cart });
});

// View cart
app.get('/cart', (req, res) => {
    const total = req.session.cart.reduce((sum, item) =>
        sum + (item.price * item.quantity), 0
    );

    res.json({
        items: req.session.cart,
        itemCount: req.session.cart.length,
        total
    });
});

// Remove from cart
app.delete('/cart/:productId', (req, res) => {
    const productId = parseInt(req.params.productId);
    req.session.cart = req.session.cart.filter(item => item.productId !== productId);
    res.json({ message: 'Removed from cart', cart: req.session.cart });
});

// Clear cart
app.delete('/cart', (req, res) => {
    req.session.cart = [];
    res.json({ message: 'Cart cleared' });
});

// Checkout
app.post('/checkout', (req, res) => {
    if (req.session.cart.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
    }

    const total = req.session.cart.reduce((sum, item) =>
        sum + (item.price * item.quantity), 0
    );

    // Process order...
    const order = {
        orderId: Math.random().toString(36).substr(2, 9),
        items: req.session.cart,
        total,
        date: new Date()
    };

    req.session.cart = [];

    res.json({ message: 'Order placed successfully', order });
});

app.listen(3000);
```

---

## Best Practices

### 1. Order Matters
```javascript
// ✅ Correct order
app.use(express.json());          // 1. Parse body first
app.use(cookieParser());           // 2. Parse cookies
app.use(session());                // 3. Initialize session
app.use(authMiddleware);           // 4. Authentication
app.get('/route', handler);        // 5. Routes
app.use(errorHandler);             // 6. Error handler last
```

### 2. Always Call next()
```javascript
// ❌ Wrong - request hangs
app.use((req, res, next) => {
    console.log('Middleware');
    // Forgot to call next()
});

// ✅ Correct
app.use((req, res, next) => {
    console.log('Middleware');
    next();
});
```

### 3. Error Handling
```javascript
// ❌ Wrong - only 3 parameters
app.use((req, res, next) => {
    res.status(500).send('Error');
});

// ✅ Correct - must have 4 parameters
app.use((err, req, res, next) => {
    res.status(500).send('Error');
});
```

### 4. Async Middleware
```javascript
// ✅ Use async wrapper
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

app.get('/data', asyncHandler(async (req, res) => {
    const data = await fetchData();
    res.json(data);
}));
```

### 5. Middleware Reusability
```javascript
// ✅ Create reusable middleware modules
// middleware/auth.js
module.exports = {
    authenticate: (req, res, next) => { /* ... */ },
    requireAdmin: (req, res, next) => { /* ... */ }
};

// app.js
const { authenticate, requireAdmin } = require('./middleware/auth');
app.get('/admin', authenticate, requireAdmin, handler);
```

---

## Exam-Ready Summary

**Middleware in Express.js is a function that has access to req, res, and next. It runs between the request and response cycle. Types include application-level (app.use()), router-level (router.use()), built-in (express.json()), third-party (cookie-parser, express-session), and error-handling (4 parameters: err, req, res, next).**

**app.use() mounts middleware and matches path prefix. app.all() is a route handler for all HTTP methods.**

**cookie-parser parses cookies, cookie-session stores session in cookies (client-side), express-session stores session on server (more secure).**

**Always call next() to pass control, use 4 parameters for error handlers, and maintain proper middleware order.**

---

## Key Interview Questions

**Q: What is middleware in Express?**
A: Functions with access to req, res, and next that execute during the request-response cycle.

**Q: Difference between cookie-session and express-session?**
A: cookie-session stores data in client cookies (limited size), express-session stores on server (more secure, unlimited size).

**Q: When to use app.use() vs app.all()?**
A: app.use() for middleware (prefix matching), app.all() for route handlers (exact matching, all HTTP methods).

**Q: What are the 4 parameters in error-handling middleware?**
A: (err, req, res, next) - Must have 4 parameters to be recognized as error handler.

---

**Created for Node.js Course - Unit II**
**Last Updated: 2024**
