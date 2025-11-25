# EventEmitter in Node.js 🎯

> **A comprehensive guide to understanding EventEmitter - the foundation of Node.js event-driven architecture**

---

## 📚 Table of Contents
- [What is EventEmitter?](#what-is-eventemitter)
- [Event-Driven Architecture](#event-driven-architecture)
- [Importing EventEmitter](#importing-eventemitter)
- [Key Methods](#key-methods)
- [Basic Examples](#basic-examples)
- [Advanced Examples](#advanced-examples)
- [Real-World Use Cases](#real-world-use-cases)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)
- [Interview Questions](#interview-questions)
- [Summary](#summary)

---

## 📖 What is EventEmitter?

**EventEmitter** is a core Node.js class that enables objects to **emit named events** and **attach listeners** to those events.

### Key Points:
- 🎪 Part of the **`events`** core module
- 🏗️ Foundation of Node.js **event-driven architecture**
- 🔄 Used by many core modules (`fs`, `http`, `net`, `stream`)
- 📡 Implements the **Observer Pattern**

### In Simple Terms:
> EventEmitter is like a notification system where objects can send signals (events) and other objects can listen and respond to those signals.

---

## 🌐 Event-Driven Architecture

Node.js follows an **event-driven architecture** where:

1. **Events** are triggered when something happens
2. **Listeners** (callbacks) respond to those events
3. Execution is **asynchronous** and **non-blocking**

```
┌──────────────┐
│   Event      │
│   Occurs     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Emit       │
│   Event      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Listeners   │
│  Execute     │
└──────────────┘
```

---

## 💻 Importing EventEmitter

EventEmitter is a **core module**, so no installation is needed.

```javascript
// Method 1: Import the class
const EventEmitter = require('events');
const emitter = new EventEmitter();

// Method 2: Destructuring
const { EventEmitter } = require('events');
const emitter = new EventEmitter();
```

---

## 🔧 Key Methods

### Core Methods Table

| Method | Purpose | Example |
|--------|---------|---------|
| `on(event, listener)` | Register a listener for an event | `emitter.on('data', callback)` |
| `emit(event, ...args)` | Trigger an event | `emitter.emit('data', value)` |
| `once(event, listener)` | Listen only once | `emitter.once('start', callback)` |
| `removeListener(event, listener)` | Remove specific listener | `emitter.removeListener('data', fn)` |
| `removeAllListeners([event])` | Remove all listeners | `emitter.removeAllListeners('data')` |
| `listenerCount(event)` | Get number of listeners | `emitter.listenerCount('data')` |
| `listeners(event)` | Get all listeners | `emitter.listeners('data')` |
| `eventNames()` | Get all event names | `emitter.eventNames()` |

---

## 🚀 Basic Examples

### Example 1: Simple Event

```javascript
const EventEmitter = require('events');
const emitter = new EventEmitter();

// Register listener
emitter.on('greet', () => {
  console.log('Hello, Node.js!');
});

// Trigger event
emitter.emit('greet');

// Output: Hello, Node.js!
```

---

### Example 2: Event with Parameters

```javascript
const EventEmitter = require('events');
const emitter = new EventEmitter();

// Listener with parameters
emitter.on('sayHello', (name, age) => {
  console.log(`Hello ${name}, you are ${age} years old`);
});

// Emit with data
emitter.emit('sayHello', 'Ronak', 22);

// Output: Hello Ronak, you are 22 years old
```

---

### Example 3: Multiple Listeners

```javascript
const EventEmitter = require('events');
const emitter = new EventEmitter();

// First listener
emitter.on('userLogin', (username) => {
  console.log(`${username} logged in`);
});

// Second listener
emitter.on('userLogin', (username) => {
  console.log(`Welcome email sent to ${username}`);
});

// Third listener
emitter.on('userLogin', (username) => {
  console.log(`Logging activity for ${username}`);
});

emitter.emit('userLogin', 'Ronak');

// Output:
// Ronak logged in
// Welcome email sent to Ronak
// Logging activity for Ronak
```

---

### Example 4: Using `once()` for One-Time Events

```javascript
const EventEmitter = require('events');
const emitter = new EventEmitter();

// Listen only once
emitter.once('start', () => {
  console.log('This runs only once.');
});

emitter.emit('start');  // This runs only once.
emitter.emit('start');  // Nothing happens
emitter.emit('start');  // Nothing happens
```

---

### Example 5: Removing Listeners

```javascript
const EventEmitter = require('events');
const emitter = new EventEmitter();

const callback = () => {
  console.log('Event triggered');
};

// Add listener
emitter.on('test', callback);

emitter.emit('test');  // Event triggered

// Remove listener
emitter.removeListener('test', callback);

emitter.emit('test');  // Nothing happens
```

---

## 🎓 Advanced Examples

### Example 6: Custom EventEmitter Class

```javascript
const EventEmitter = require('events');

class Logger extends EventEmitter {
  log(message) {
    console.log(`[LOG] ${message}`);
    this.emit('logged', {
      message,
      timestamp: new Date().toISOString()
    });
  }

  error(message) {
    console.error(`[ERROR] ${message}`);
    this.emit('error', {
      message,
      timestamp: new Date().toISOString()
    });
  }
}

// Usage
const logger = new Logger();

// Add listeners
logger.on('logged', (data) => {
  console.log('Log recorded:', data);
});

logger.on('error', (data) => {
  console.log('Error recorded:', data);
});

// Trigger events
logger.log('Application started');
logger.error('Something went wrong');
```

---

### Example 7: Real-Time Notification System

```javascript
const EventEmitter = require('events');

class NotificationService extends EventEmitter {
  sendNotification(user, message) {
    console.log(`Sending notification to ${user}`);
    this.emit('notificationSent', { user, message });
  }
}

const notifier = new NotificationService();

// SMS listener
notifier.on('notificationSent', (data) => {
  console.log(`📱 SMS sent to ${data.user}: ${data.message}`);
});

// Email listener
notifier.on('notificationSent', (data) => {
  console.log(`📧 Email sent to ${data.user}: ${data.message}`);
});

// Push notification listener
notifier.on('notificationSent', (data) => {
  console.log(`🔔 Push notification to ${data.user}: ${data.message}`);
});

notifier.sendNotification('Ronak', 'Your order is confirmed!');
```

**Output:**
```
Sending notification to Ronak
📱 SMS sent to Ronak: Your order is confirmed!
📧 Email sent to Ronak: Your order is confirmed!
🔔 Push notification to Ronak: Your order is confirmed!
```

---

### Example 8: Event-Driven Task Queue

```javascript
const EventEmitter = require('events');

class TaskQueue extends EventEmitter {
  constructor() {
    super();
    this.tasks = [];
  }

  addTask(task) {
    this.tasks.push(task);
    this.emit('taskAdded', task);
  }

  processNext() {
    if (this.tasks.length > 0) {
      const task = this.tasks.shift();
      this.emit('taskProcessing', task);
      setTimeout(() => {
        this.emit('taskCompleted', task);
      }, 1000);
    }
  }
}

const queue = new TaskQueue();

queue.on('taskAdded', (task) => {
  console.log(`✅ Task added: ${task}`);
});

queue.on('taskProcessing', (task) => {
  console.log(`⚙️  Processing: ${task}`);
});

queue.on('taskCompleted', (task) => {
  console.log(`✔️  Completed: ${task}`);
});

queue.addTask('Send Email');
queue.addTask('Generate Report');
queue.processNext();
queue.processNext();
```

---

## 🌍 Real-World Use Cases

### 1. **HTTP Server Events**
```javascript
const http = require('http');

const server = http.createServer();

server.on('request', (req, res) => {
  console.log('Request received');
  res.end('Hello World');
});

server.on('connection', (socket) => {
  console.log('New connection established');
});

server.listen(3000);
```

---

### 2. **File Stream Events**
```javascript
const fs = require('fs');

const readStream = fs.createReadStream('large-file.txt');

readStream.on('data', (chunk) => {
  console.log('Received chunk:', chunk.length);
});

readStream.on('end', () => {
  console.log('File reading completed');
});

readStream.on('error', (err) => {
  console.error('Error:', err.message);
});
```

---

### 3. **Database Connection Events**
```javascript
const EventEmitter = require('events');

class Database extends EventEmitter {
  connect() {
    setTimeout(() => {
      console.log('Connecting to database...');
      this.emit('connected');
    }, 1000);
  }

  disconnect() {
    console.log('Disconnecting...');
    this.emit('disconnected');
  }
}

const db = new Database();

db.on('connected', () => {
  console.log('✅ Database connected successfully');
});

db.on('disconnected', () => {
  console.log('❌ Database disconnected');
});

db.connect();
```

---

### 4. **Real-Time Chat Application**
```javascript
const EventEmitter = require('events');

class ChatRoom extends EventEmitter {
  sendMessage(user, message) {
    this.emit('message', { user, message, time: new Date() });
  }

  userJoined(username) {
    this.emit('userJoined', username);
  }
}

const chatRoom = new ChatRoom();

chatRoom.on('message', (data) => {
  console.log(`[${data.time.toLocaleTimeString()}] ${data.user}: ${data.message}`);
});

chatRoom.on('userJoined', (username) => {
  console.log(`👋 ${username} joined the chat`);
});

chatRoom.userJoined('Ronak');
chatRoom.sendMessage('Ronak', 'Hello everyone!');
```

---

## ⚠️ Error Handling

### The Special 'error' Event

If an 'error' event is emitted and no listener is registered, Node.js will **throw an exception** and crash.

#### ❌ Bad Practice:
```javascript
const EventEmitter = require('events');
const emitter = new EventEmitter();

emitter.emit('error', new Error('Something went wrong'));
// This will crash the application!
```

#### ✅ Good Practice:
```javascript
const EventEmitter = require('events');
const emitter = new EventEmitter();

// Always handle error events
emitter.on('error', (err) => {
  console.error('Error occurred:', err.message);
});

emitter.emit('error', new Error('Something went wrong'));
// Output: Error occurred: Something went wrong
```

---

## 📋 Best Practices

### 1. **Always Handle Error Events**
```javascript
emitter.on('error', (err) => {
  console.error('Error:', err);
});
```

---

### 2. **Remove Listeners When Done**
```javascript
const listener = () => console.log('Event');
emitter.on('test', listener);

// Later...
emitter.removeListener('test', listener);
```

---

### 3. **Use `once()` for One-Time Events**
```javascript
emitter.once('initialize', () => {
  console.log('Initialized');
});
```

---

### 4. **Avoid Memory Leaks**
```javascript
// Check listener count
console.log(emitter.listenerCount('data'));

// Node.js warns if more than 10 listeners
emitter.setMaxListeners(20); // Increase if needed
```

---

### 5. **Use Descriptive Event Names**
```javascript
// ❌ Bad
emitter.emit('e1');

// ✅ Good
emitter.emit('userRegistered');
emitter.emit('paymentCompleted');
```

---

## 🎤 Interview Questions

### Q1: What is EventEmitter in Node.js?
**Answer:** EventEmitter is a core Node.js class from the 'events' module that enables objects to emit named events and attach listener functions to those events. It implements the Observer pattern and is fundamental to Node's event-driven architecture.

---

### Q2: Difference between `on()` and `once()`?
**Answer:**
- `on()`: Listener is called every time the event is emitted
- `once()`: Listener is called only the first time the event is emitted, then automatically removed

---

### Q3: What happens if you emit an 'error' event without a listener?
**Answer:** If an 'error' event is emitted and no listener is registered, Node.js throws an exception and the process crashes.

---

### Q4: How many listeners can you attach to a single event?
**Answer:** By default, Node.js allows up to 10 listeners per event. Beyond that, it issues a warning. You can change this using `setMaxListeners()`.

---

### Q5: Real-world analogy for EventEmitter?
**Answer:** EventEmitter is like YouTube notifications:
- You **subscribe** to a channel → `on()`
- Channel **publishes** a video → `emit()`
- You receive a **notification** because you subscribed

---

## 📝 Summary (Perfect for Exams)

> **EventEmitter is a core Node.js class that allows objects to emit named events and attach listeners to those events. It is the foundation of Node's event-driven architecture. Events are triggered using `emit()` and listened to using `on()` or `once()` methods. It implements the Observer pattern and is used extensively by core modules like `http`, `fs`, and `stream`.**

### Key Takeaways:
✅ Part of the **events** core module
✅ Foundation of **event-driven architecture**
✅ Uses `on()` to register listeners
✅ Uses `emit()` to trigger events
✅ Always handle **'error'** events
✅ Supports multiple listeners per event
✅ Used by `http`, `fs`, `stream`, and more
✅ Implements **Observer Pattern**

---

## 🎯 Quick Reference

```javascript
const EventEmitter = require('events');
const emitter = new EventEmitter();

// Register listener
emitter.on('event', (data) => console.log(data));

// Trigger event
emitter.emit('event', 'Hello');

// One-time listener
emitter.once('start', () => console.log('Started'));

// Remove listener
emitter.removeListener('event', callback);

// Remove all listeners
emitter.removeAllListeners('event');

// Get listener count
emitter.listenerCount('event');
```

---

## 📚 Related Topics

1. **Callbacks in Node.js**
2. **Promises and Async/Await**
3. **Streams in Node.js**
4. **Event Loop**
5. **Observer Pattern**

---

## 🔗 Resources

- [Node.js Events Documentation](https://nodejs.org/api/events.html)
- [MDN - Observer Pattern](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [Event-Driven Programming](https://nodejs.dev/learn)

---

**Happy Learning! 🎉**

*Last Updated: 2024*
