# Unit II: Basic Websites with Node.js – Introducing Express.js

## Table of Contents
1. [What is Express.js?](#what-is-expressjs)
2. [Installation & Setup](#installation--setup)
3. [Basic Express Server](#basic-express-server)
4. [Routing in Express](#routing-in-express)
5. [Middleware Concept](#middleware-concept)
6. [Handling Different HTTP Methods](#handling-different-http-methods)
7. [Body Parsing](#body-parsing)
8. [Express Router](#express-router)
9. [Serving Static Files](#serving-static-files)
10. [Sending Different Response Types](#sending-different-response-types)
11. [Express Validator](#express-validator)
12. [Error Handling](#error-handling)
13. [Complete Project Examples](#complete-project-examples)

---

## What is Express.js?

Express.js is a **minimal**, **fast**, and **unopinionated** web application framework for Node.js. It's built on top of Node.js's built-in `http` module and provides a robust set of features for web and mobile applications.

### Why Use Express.js?

| Feature | Raw Node.js | Express.js |
|---------|-------------|------------|
| Server Setup | 10+ lines | 3-4 lines |
| Routing | Manual parsing | Built-in methods |
| Middleware | Custom implementation | Ready-to-use |
| Template Engines | Manual integration | Easy integration |
| JSON Handling | Manual parsing | One-line setup |

### Key Features:
- **Routing**: Define routes for different HTTP methods and URLs
- **Middleware**: Functions that process requests before reaching route handlers
- **Template Engines**: Support for Pug, EJS, Handlebars
- **Static Files**: Easy serving of CSS, JS, images
- **Error Handling**: Built-in error handling mechanisms
- **API Development**: Perfect for building RESTful APIs

---

## Installation & Setup

### Step 1: Initialize Node.js Project
```bash
mkdir express-project
cd express-project
npm init -y
```

### Step 2: Install Express
```bash
npm install express
```

### Step 3: Install Additional Packages (Optional)
```bash
npm install nodemon --save-dev  # Auto-restart server
npm install express-validator    # Form validation
npm install dotenv                # Environment variables
```

### Step 4: Update package.json
```json
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  }
}
```

---

## Basic Express Server

### Minimal Server Example

```javascript
const express = require('express');
const app = express();
const PORT = 3000;

// Define a route
app.get('/', (req, res) => {
    res.send("Hello from Express!");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
```

**Run:** `node app.js` or `npm run dev`

### Understanding the Code:
- `express()`: Creates an Express application
- `app.get()`: Defines a GET route handler
- `req`: Request object (contains request data)
- `res`: Response object (sends response back)
- `app.listen()`: Starts the server on specified port

---

## Routing in Express

### Basic Routes

```javascript
const express = require('express');
const app = express();

// Home route
app.get('/', (req, res) => {
    res.send("Home Page");
});

// About route
app.get('/about', (req, res) => {
    res.send("About Page");
});

// Contact route
app.get('/contact', (req, res) => {
    res.send("Contact Page");
});

// 404 route (must be last)
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

app.listen(3000);
```

### Route Parameters (Dynamic Routes)

```javascript
// User profile with dynamic ID
app.get('/user/:id', (req, res) => {
    const userId = req.params.id;
    res.send(`User ID: ${userId}`);
});

// Multiple parameters
app.get('/post/:year/:month/:day', (req, res) => {
    const { year, month, day } = req.params;
    res.send(`Date: ${year}-${month}-${day}`);
});

// Optional parameters
app.get('/product/:id?', (req, res) => {
    if (req.params.id) {
        res.send(`Product ID: ${req.params.id}`);
    } else {
        res.send("All Products");
    }
});
```

### Query Parameters

```javascript
// URL: /search?keyword=express&limit=10
app.get('/search', (req, res) => {
    const keyword = req.query.keyword;
    const limit = req.query.limit || 5;
    res.send(`Search: ${keyword}, Limit: ${limit}`);
});
```

---

## Middleware Concept

Middleware functions have access to `req`, `res`, and `next()`. They can:
- Execute code
- Modify req/res objects
- End the request-response cycle
- Call the next middleware

### Types of Middleware:

#### 1. Application-Level Middleware
```javascript
// Logger middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    next(); // Pass control to next middleware
});
```

#### 2. Route-Level Middleware
```javascript
// Authentication middleware
const authenticate = (req, res, next) => {
    const token = req.headers.authorization;
    if (token === 'secret-token') {
        next();
    } else {
        res.status(401).send("Unauthorized");
    }
};

app.get('/dashboard', authenticate, (req, res) => {
    res.send("Welcome to Dashboard");
});
```

#### 3. Built-in Middleware
```javascript
// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));
```

#### 4. Third-Party Middleware
```javascript
const morgan = require('morgan');
app.use(morgan('dev')); // HTTP request logger
```

#### 5. Error-Handling Middleware
```javascript
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
```

---

## Handling Different HTTP Methods

### Complete CRUD Example

```javascript
const express = require('express');
const app = express();
app.use(express.json());

let users = [
    { id: 1, name: "Ronak", email: "ronak@example.com" },
    { id: 2, name: "Priya", email: "priya@example.com" }
];

// GET - Read all users
app.get('/api/users', (req, res) => {
    res.json(users);
});

// GET - Read single user
app.get('/api/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
});

// POST - Create new user
app.post('/api/users', (req, res) => {
    const newUser = {
        id: users.length + 1,
        name: req.body.name,
        email: req.body.email
    };
    users.push(newUser);
    res.status(201).json(newUser);
});

// PUT - Update user
app.put('/api/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ error: "User not found" });
    
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    res.json(user);
});

// DELETE - Remove user
app.delete('/api/users/:id', (req, res) => {
    const index = users.findIndex(u => u.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: "User not found" });
    
    const deleted = users.splice(index, 1);
    res.json({ message: "User deleted", user: deleted[0] });
});

app.listen(3000);
```

---

## Body Parsing

### JSON Body Parsing

```javascript
app.use(express.json());

app.post('/api/data', (req, res) => {
    console.log(req.body); // Access parsed JSON data
    res.json({ received: req.body });
});
```

**Test with curl:**
```bash
curl -X POST http://localhost:3000/api/data \
  -H "Content-Type: application/json" \
  -d '{"name":"Ronak","age":21}'
```

### URL-Encoded Body Parsing (Form Data)

```javascript
app.use(express.urlencoded({ extended: true }));

app.post('/submit-form', (req, res) => {
    const { username, password } = req.body;
    res.send(`Username: ${username}`);
});
```

**HTML Form:**
```html
<form action="/submit-form" method="POST">
    <input type="text" name="username" required>
    <input type="password" name="password" required>
    <button type="submit">Submit</button>
</form>
```

---

## Express Router

### Why Use Router?
- **Modular routing**: Split routes into separate files
- **Better organization**: Group related routes
- **Reusability**: Use same router in multiple places

### Example: User Routes Module

**routes/userRoutes.js:**
```javascript
const express = require('express');
const router = express.Router();

// Middleware specific to this router
router.use((req, res, next) => {
    console.log('User route accessed');
    next();
});

// Routes
router.get('/', (req, res) => {
    res.json({ message: "Get all users" });
});

router.get('/:id', (req, res) => {
    res.json({ message: `Get user ${req.params.id}` });
});

router.post('/', (req, res) => {
    res.json({ message: "Create user", data: req.body });
});

router.put('/:id', (req, res) => {
    res.json({ message: `Update user ${req.params.id}` });
});

router.delete('/:id', (req, res) => {
    res.json({ message: `Delete user ${req.params.id}` });
});

module.exports = router;
```

**routes/productRoutes.js:**
```javascript
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: "Get all products" });
});

router.get('/:id', (req, res) => {
    res.json({ message: `Get product ${req.params.id}` });
});

module.exports = router;
```

**app.js:**
```javascript
const express = require('express');
const app = express();

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

app.use(express.json());

// Mount routers
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
```

**Routes available:**
- `/api/users` → Get all users
- `/api/users/123` → Get user with ID 123
- `/api/products` → Get all products
- `/api/products/456` → Get product with ID 456

---

## Serving Static Files

### Setup Static Files Directory

```javascript
const express = require('express');
const path = require('path');
const app = express();

// Serve files from 'public' directory
app.use(express.static('public'));

// Multiple static directories
app.use('/assets', express.static('assets'));
app.use('/uploads', express.static('uploads'));

app.listen(3000);
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

### Serving HTML Files

```javascript
const express = require('express');
const path = require('path');
const app = express();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

app.listen(3000);
```

---

## Sending Different Response Types

### 1. Text Response
```javascript
app.get('/text', (req, res) => {
    res.send("Plain text response");
});
```

### 2. HTML Response
```javascript
app.get('/html', (req, res) => {
    res.send('<h1>HTML Response</h1><p>This is HTML</p>');
});
```

### 3. JSON Response
```javascript
app.get('/json', (req, res) => {
    res.json({ 
        name: "Ronak", 
        age: 21,
        skills: ["Node.js", "Express", "MongoDB"]
    });
});
```

### 4. File Download
```javascript
app.get('/download', (req, res) => {
    res.download('files/document.pdf');
});
```

### 5. Redirect
```javascript
app.get('/old-route', (req, res) => {
    res.redirect('/new-route');
});

app.get('/new-route', (req, res) => {
    res.send("You've been redirected!");
});
```

### 6. Status Codes
```javascript
app.get('/created', (req, res) => {
    res.status(201).json({ message: "Resource created" });
});

app.get('/not-found', (req, res) => {
    res.status(404).json({ error: "Not found" });
});

app.get('/error', (req, res) => {
    res.status(500).json({ error: "Internal server error" });
});
```

---

## Express Validator

### Installation
```bash
npm install express-validator
```

### Basic Validation Example

```javascript
const express = require('express');
const { body, validationResult } = require('express-validator');
const app = express();

app.use(express.json());

// Registration with validation
app.post('/register',
    [
        body('username')
            .isLength({ min: 3, max: 20 })
            .withMessage('Username must be 3-20 characters'),
        body('email')
            .isEmail()
            .withMessage('Invalid email address'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters')
            .matches(/\d/)
            .withMessage('Password must contain a number'),
        body('age')
            .optional()
            .isInt({ min: 18, max: 100 })
            .withMessage('Age must be between 18 and 100')
    ],
    (req, res) => {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        res.json({ 
            message: "Registration successful",
            user: req.body
        });
    }
);

app.listen(3000);
```

### Advanced Validation Examples

```javascript
const { body, param, query, validationResult } = require('express-validator');

// Custom validator
const isStrongPassword = (value) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(value);
};

// Login validation
app.post('/login',
    [
        body('email').isEmail().normalizeEmail(),
        body('password').notEmpty()
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        res.json({ message: "Login successful" });
    }
);

// Update profile validation
app.put('/profile/:id',
    [
        param('id').isInt().withMessage('Invalid user ID'),
        body('name').optional().isLength({ min: 2 }),
        body('phone').optional().isMobilePhone('any'),
        body('website').optional().isURL()
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        res.json({ message: "Profile updated" });
    }
);

// Search with query validation
app.get('/search',
    [
        query('q').notEmpty().withMessage('Search query required'),
        query('page').optional().isInt({ min: 1 }),
        query('limit').optional().isInt({ min: 1, max: 100 })
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        res.json({ 
            query: req.query.q,
            page: req.query.page || 1,
            limit: req.query.limit || 10
        });
    }
);
```

### Custom Validation Messages

```javascript
app.post('/signup',
    [
        body('email')
            .isEmail().withMessage('Please provide a valid email')
            .normalizeEmail(),
        body('password')
            .custom(isStrongPassword)
            .withMessage('Password must contain uppercase, lowercase, number and special character'),
        body('confirmPassword')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Passwords do not match');
                }
                return true;
            })
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        res.json({ message: "Account created" });
    }
);
```

---

## Error Handling

### Basic Error Handler

```javascript
const express = require('express');
const app = express();

app.get('/error', (req, res) => {
    throw new Error('Something went wrong!');
});

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({ 
        error: 'Route not found',
        path: req.url
    });
});

// Global error handler (must be last)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

app.listen(3000);
```

### Async Error Handling

```javascript
// Async wrapper to catch errors
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Usage
app.get('/async-route', asyncHandler(async (req, res) => {
    const data = await fetchDataFromDatabase();
    res.json(data);
}));
```

### Custom Error Classes

```javascript
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

app.get('/protected', (req, res, next) => {
    if (!req.user) {
        return next(new AppError('Unauthorized access', 401));
    }
    res.json({ message: 'Protected content' });
});

// Error handler
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal Server Error';
    
    res.status(err.statusCode).json({
        status: 'error',
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});
```

---

## Complete Project Examples

### Example 1: Simple Blog API

```javascript
const express = require('express');
const { body, validationResult } = require('express-validator');
const app = express();

app.use(express.json());

// In-memory database
let posts = [
    { id: 1, title: "First Post", content: "Hello World", author: "Ronak" },
    { id: 2, title: "Second Post", content: "Express is awesome", author: "Priya" }
];
let nextId = 3;

// GET all posts
app.get('/api/posts', (req, res) => {
    res.json(posts);
});

// GET single post
app.get('/api/posts/:id', (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
});

// CREATE post
app.post('/api/posts',
    [
        body('title').notEmpty().isLength({ min: 5, max: 100 }),
        body('content').notEmpty().isLength({ min: 10 }),
        body('author').notEmpty()
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const newPost = {
            id: nextId++,
            title: req.body.title,
            content: req.body.content,
            author: req.body.author,
            createdAt: new Date()
        };
        
        posts.push(newPost);
        res.status(201).json(newPost);
    }
);

// UPDATE post
app.put('/api/posts/:id',
    [
        body('title').optional().isLength({ min: 5, max: 100 }),
        body('content').optional().isLength({ min: 10 })
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const post = posts.find(p => p.id === parseInt(req.params.id));
        if (!post) return res.status(404).json({ error: 'Post not found' });
        
        post.title = req.body.title || post.title;
        post.content = req.body.content || post.content;
        post.updatedAt = new Date();
        
        res.json(post);
    }
);

// DELETE post
app.delete('/api/posts/:id', (req, res) => {
    const index = posts.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: 'Post not found' });
    
    const deleted = posts.splice(index, 1);
    res.json({ message: 'Post deleted', post: deleted[0] });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
});

app.listen(3000, () => {
    console.log('Blog API running on port 3000');
});
```

### Example 2: User Authentication System

```javascript
const express = require('express');
const { body, validationResult } = require('express-validator');
const app = express();

app.use(express.json());

// Mock database
const users = [];
const sessions = new Map();

// Helper function to generate token
const generateToken = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Middleware to check authentication
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    
    const userId = sessions.get(token);
    if (!userId) {
        return res.status(401).json({ error: 'Invalid token' });
    }
    
    req.user = users.find(u => u.id === userId);
    next();
};

// Register
app.post('/auth/register',
    [
        body('username').isLength({ min: 3, max: 20 }),
        body('email').isEmail().normalizeEmail(),
        body('password').isLength({ min: 6 })
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        // Check if user exists
        if (users.find(u => u.email === req.body.email)) {
            return res.status(400).json({ error: 'Email already registered' });
        }
        
        const newUser = {
            id: users.length + 1,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password, // In real app, hash this!
            createdAt: new Date()
        };
        
        users.push(newUser);
        
        res.status(201).json({ 
            message: 'User registered successfully',
            user: { id: newUser.id, username: newUser.username, email: newUser.email }
        });
    }
);

// Login
app.post('/auth/login',
    [
        body('email').isEmail(),
        body('password').notEmpty()
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const user = users.find(u => 
            u.email === req.body.email && u.password === req.body.password
        );
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = generateToken();
        sessions.set(token, user.id);
        
        res.json({ 
            message: 'Login successful',
            token,
            user: { id: user.id, username: user.username, email: user.email }
        });
    }
);

// Get profile (protected route)
app.get('/auth/profile', authenticate, (req, res) => {
    res.json({ 
        user: { 
            id: req.user.id, 
            username: req.user.username, 
            email: req.user.email 
        }
    });
});

// Logout
app.post('/auth/logout', authenticate, (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    sessions.delete(token);
    res.json({ message: 'Logout successful' });
});

app.listen(3000, () => {
    console.log('Auth API running on port 3000');
});
```

---

## Exam-Ready Summary

### Key Points to Remember:

1. **Express.js** is a minimal and flexible Node.js web application framework
2. **app.get(), app.post(), app.put(), app.delete()** handle different HTTP methods
3. **Middleware** functions execute in sequence and have access to req, res, and next()
4. **express.json()** parses JSON request bodies
5. **express.urlencoded()** parses URL-encoded form data
6. **express.Router()** creates modular, mountable route handlers
7. **express.static()** serves static files (CSS, JS, images)
8. **express-validator** provides request validation middleware
9. **req.params** accesses route parameters (e.g., /user/:id)
10. **req.query** accesses query string parameters (e.g., ?search=express)
11. **req.body** accesses parsed request body data
12. **res.send()** sends various response types
13. **res.json()** sends JSON response
14. **res.sendFile()** sends a file
15. **res.status()** sets HTTP status code

### Common Interview Questions:

**Q: What is middleware in Express?**
A: Middleware functions are functions that have access to the request object (req), response object (res), and the next middleware function. They can execute code, modify req/res objects, end the request-response cycle, or call the next middleware.

**Q: Difference between app.use() and app.get()?**
A: app.use() is for middleware and matches any HTTP method, while app.get() is specifically for GET requests on a defined route.

**Q: What is express.Router()?**
A: Router is a mini Express application used to organize routes into separate modules, making code more modular and maintainable.

**Q: How does body parsing work?**
A: Express uses middleware like express.json() and express.urlencoded() to parse incoming request bodies into req.body object.

---

## Next Steps

After mastering Express.js, proceed to:
- **Template Engines** (EJS, Pug)
- **Database Integration** (MongoDB, MySQL)
- **Authentication & Authorization**
- **REST API Best Practices**
- **WebSockets & Socket.IO** ✨ (Next Unit)

---

**Created for Node.js Course - Unit II**
**Last Updated: 2024**
