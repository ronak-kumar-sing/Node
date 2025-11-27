# File System (fs) Module in Node.js 📁

> **A comprehensive guide to handling Data I/O and file operations in Node.js**

---

## 📚 Table of Contents
- [What is the fs Module?](#what-is-the-fs-module)
- [Importing fs Module](#importing-fs-module)
- [Reading Files](#reading-files)
- [Writing Files](#writing-files)
- [Appending Data](#appending-data)
- [Deleting Files](#deleting-files)
- [Renaming Files](#renaming-files)
- [Directory Operations](#directory-operations)
- [File Stats](#file-stats)
- [Working with Streams](#working-with-streams)
- [fs Promises API](#fs-promises-api)
- [Real-World Examples](#real-world-examples)
- [Best Practices](#best-practices)
- [Interview Questions](#interview-questions)
- [Summary](#summary)

---

## 📖 What is the fs Module?

**`fs`** stands for **File System**. It is a **core module** in Node.js used to interact with files and directories.

### Operations You Can Perform:
- 📖 **Read** files
- ✍️ **Write** files
- 🗑️ **Delete** files
- 📄 **Create** files
- ➕ **Append** data
- 🔄 **Rename** files
- 📊 **Check file status** (stats)
- 📁 **Manage directories**

### Key Points:
- ✅ **Core Module**: No npm installation required
- ✅ **Two Modes**: Synchronous and Asynchronous
- ✅ **Non-Blocking**: Async methods preferred
- ✅ **Widely Used**: Essential for backend development

---

## 💻 Importing fs Module

Since `fs` is a core module, simply require it:

```javascript
// CommonJS
const fs = require('fs');

// ES6 Modules
import fs from 'fs';

// For Promises API
const fs = require('fs').promises;
// or
const { promises: fsPromises } = require('fs');
```

---

## 📖 Reading Files

### 1️⃣ Asynchronous Read (Recommended)

```javascript
const fs = require('fs');

fs.readFile('test.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err.message);
    return;
  }
  console.log('File content:', data);
});

console.log('This runs before file is read!');
```

**Output:**
```
This runs before file is read!
File content: [content of test.txt]
```

---

### 2️⃣ Synchronous Read (Blocking)

```javascript
const fs = require('fs');

try {
  const data = fs.readFileSync('test.txt', 'utf8');
  console.log('File content:', data);
} catch (err) {
  console.error('Error:', err.message);
}

console.log('This runs after file is read');
```

**Output:**
```
File content: [content of test.txt]
This runs after file is read
```

---

### 3️⃣ Comparison: Async vs Sync

| Feature | Asynchronous | Synchronous |
|---------|--------------|-------------|
| **Method** | `readFile()` | `readFileSync()` |
| **Blocking** | No | Yes |
| **Performance** | Better | Slower |
| **Error Handling** | Callback | try-catch |
| **Use Case** | Production | Simple scripts |

---

### 4️⃣ Reading with Different Encodings

```javascript
const fs = require('fs');

// UTF-8 (text)
fs.readFile('text.txt', 'utf8', (err, data) => {
  console.log(data); // String
});

// Binary (no encoding)
fs.readFile('image.png', (err, data) => {
  console.log(data); // Buffer
});

// Base64
fs.readFile('image.png', 'base64', (err, data) => {
  console.log(data); // Base64 string
});
```

---

## ✍️ Writing Files

### 1️⃣ Asynchronous Write

```javascript
const fs = require('fs');

const content = 'Hello Node.js!\nThis is a new file.';

fs.writeFile('output.txt', content, 'utf8', (err) => {
  if (err) {
    console.error('Error writing file:', err.message);
    return;
  }
  console.log('File created successfully!');
});
```

**Note:** This **creates** the file if it doesn't exist, or **overwrites** if it does.

---

### 2️⃣ Synchronous Write

```javascript
const fs = require('fs');

try {
  fs.writeFileSync('output.txt', 'Hello World!', 'utf8');
  console.log('File created!');
} catch (err) {
  console.error('Error:', err.message);
}
```

---

### 3️⃣ Write with Options

```javascript
const fs = require('fs');

const options = {
  encoding: 'utf8',
  mode: 0o666,  // File permissions
  flag: 'w'     // Write mode
};

fs.writeFile('output.txt', 'Content here', options, (err) => {
  if (err) throw err;
  console.log('File written with options!');
});
```

### File Flags:

| Flag | Description |
|------|-------------|
| `'w'` | Write (create/overwrite) |
| `'a'` | Append |
| `'r'` | Read |
| `'r+'` | Read and write |
| `'wx'` | Write (fail if exists) |

---

## ➕ Appending Data

### 1️⃣ Asynchronous Append

```javascript
const fs = require('fs');

fs.appendFile('log.txt', 'New log entry\n', (err) => {
  if (err) {
    console.error('Error:', err.message);
    return;
  }
  console.log('Data appended successfully!');
});
```

---

### 2️⃣ Synchronous Append

```javascript
const fs = require('fs');

try {
  fs.appendFileSync('log.txt', 'Another entry\n');
  console.log('Data appended!');
} catch (err) {
  console.error('Error:', err.message);
}
```

---

### 3️⃣ Append with Timestamp

```javascript
const fs = require('fs');

function logMessage(message) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;

  fs.appendFile('app.log', logEntry, (err) => {
    if (err) throw err;
    console.log('Log entry added');
  });
}

logMessage('Application started');
logMessage('User logged in');
logMessage('Processing data');
```

**Output in app.log:**
```
[2024-01-15T10:30:00.000Z] Application started
[2024-01-15T10:30:01.000Z] User logged in
[2024-01-15T10:30:02.000Z] Processing data
```

---

## 🗑️ Deleting Files

### 1️⃣ Asynchronous Delete

```javascript
const fs = require('fs');

fs.unlink('output.txt', (err) => {
  if (err) {
    console.error('Error deleting file:', err.message);
    return;
  }
  console.log('File deleted successfully!');
});
```

---

### 2️⃣ Synchronous Delete

```javascript
const fs = require('fs');

try {
  fs.unlinkSync('output.txt');
  console.log('File deleted!');
} catch (err) {
  console.error('Error:', err.message);
}
```

---

### 3️⃣ Check Before Delete

```javascript
const fs = require('fs');

const filePath = 'output.txt';

// Check if file exists before deleting
if (fs.existsSync(filePath)) {
  fs.unlink(filePath, (err) => {
    if (err) throw err;
    console.log('File deleted!');
  });
} else {
  console.log('File does not exist');
}
```

---

## 🔄 Renaming Files

### 1️⃣ Asynchronous Rename

```javascript
const fs = require('fs');

fs.rename('old-name.txt', 'new-name.txt', (err) => {
  if (err) {
    console.error('Error:', err.message);
    return;
  }
  console.log('File renamed successfully!');
});
```

---

### 2️⃣ Move File (Rename with Path)

```javascript
const fs = require('fs');

// Move file to different directory
fs.rename('file.txt', './backup/file.txt', (err) => {
  if (err) throw err;
  console.log('File moved!');
});
```

---

### 3️⃣ Synchronous Rename

```javascript
const fs = require('fs');

try {
  fs.renameSync('old.txt', 'new.txt');
  console.log('File renamed!');
} catch (err) {
  console.error('Error:', err.message);
}
```

---

## 📁 Directory Operations

### 1️⃣ Create Directory

```javascript
const fs = require('fs');

// Simple directory creation
fs.mkdir('newFolder', (err) => {
  if (err) {
    console.error('Error:', err.message);
    return;
  }
  console.log('Directory created!');
});

// Create nested directories (recursive)
fs.mkdir('path/to/nested/folder', { recursive: true }, (err) => {
  if (err) throw err;
  console.log('Nested directories created!');
});
```

---

### 2️⃣ Read Directory Contents

```javascript
const fs = require('fs');

fs.readdir('.', (err, files) => {
  if (err) {
    console.error('Error:', err.message);
    return;
  }
  console.log('Directory contents:', files);
});

// Output: ['app.js', 'index.js', 'data.txt', 'node_modules']
```

---

### 3️⃣ Read Directory with File Types

```javascript
const fs = require('fs');

fs.readdir('.', { withFileTypes: true }, (err, entries) => {
  if (err) throw err;

  entries.forEach(entry => {
    if (entry.isDirectory()) {
      console.log(`📁 ${entry.name}/`);
    } else {
      console.log(`📄 ${entry.name}`);
    }
  });
});
```

---

### 4️⃣ Remove Directory

```javascript
const fs = require('fs');

// Remove empty directory
fs.rmdir('emptyFolder', (err) => {
  if (err) throw err;
  console.log('Directory removed!');
});

// Remove directory with contents (recursive)
fs.rm('folderWithFiles', { recursive: true, force: true }, (err) => {
  if (err) throw err;
  console.log('Directory and contents removed!');
});
```

---

## 📊 File Stats

### 1️⃣ Get File Information

```javascript
const fs = require('fs');

fs.stat('test.txt', (err, stats) => {
  if (err) {
    console.error('Error:', err.message);
    return;
  }

  console.log('File Stats:');
  console.log('Size:', stats.size, 'bytes');
  console.log('Created:', stats.birthtime);
  console.log('Modified:', stats.mtime);
  console.log('Is File:', stats.isFile());
  console.log('Is Directory:', stats.isDirectory());
});
```

---

### 2️⃣ Stats Object Properties

| Property | Description |
|----------|-------------|
| `stats.size` | File size in bytes |
| `stats.birthtime` | Creation time |
| `stats.mtime` | Last modified time |
| `stats.atime` | Last access time |
| `stats.isFile()` | Returns true if file |
| `stats.isDirectory()` | Returns true if directory |
| `stats.isSymbolicLink()` | Returns true if symlink |

---

### 3️⃣ Check File Existence

```javascript
const fs = require('fs');

// Method 1: Using existsSync
if (fs.existsSync('file.txt')) {
  console.log('File exists!');
} else {
  console.log('File does not exist');
}

// Method 2: Using access (async)
fs.access('file.txt', fs.constants.F_OK, (err) => {
  if (err) {
    console.log('File does not exist');
  } else {
    console.log('File exists!');
  }
});
```

---

## 🌊 Working with Streams

Streams are efficient for handling large files.

### 1️⃣ Read Stream

```javascript
const fs = require('fs');

const readStream = fs.createReadStream('large-file.txt', 'utf8');

readStream.on('data', (chunk) => {
  console.log('Received chunk:', chunk.length, 'bytes');
});

readStream.on('end', () => {
  console.log('Finished reading file');
});

readStream.on('error', (err) => {
  console.error('Error:', err.message);
});
```

---

### 2️⃣ Write Stream

```javascript
const fs = require('fs');

const writeStream = fs.createWriteStream('output.txt');

writeStream.write('First line\n');
writeStream.write('Second line\n');
writeStream.write('Third line\n');
writeStream.end();

writeStream.on('finish', () => {
  console.log('File written successfully');
});
```

---

### 3️⃣ Pipe Streams (Copy File)

```javascript
const fs = require('fs');

const readStream = fs.createReadStream('source.txt');
const writeStream = fs.createWriteStream('destination.txt');

readStream.pipe(writeStream);

writeStream.on('finish', () => {
  console.log('File copied successfully!');
});
```

---

### 4️⃣ Stream vs Regular Read

```javascript
// ❌ Bad for large files (loads entire file in memory)
fs.readFile('huge-file.txt', (err, data) => {
  // 500MB file = 500MB memory used
});

// ✅ Good for large files (processes in chunks)
const stream = fs.createReadStream('huge-file.txt');
stream.on('data', (chunk) => {
  // Only 64KB at a time in memory
});
```

---

## 🎯 fs Promises API

Modern approach using async/await.

### 1️⃣ Using fs.promises

```javascript
const fs = require('fs').promises;

async function readFile() {
  try {
    const data = await fs.readFile('test.txt', 'utf8');
    console.log(data);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

readFile();
```

---

### 2️⃣ Multiple File Operations

```javascript
const fs = require('fs').promises;

async function processFiles() {
  try {
    // Read file
    const data = await fs.readFile('input.txt', 'utf8');

    // Process data
    const processed = data.toUpperCase();

    // Write file
    await fs.writeFile('output.txt', processed);

    console.log('File processed successfully!');
  } catch (err) {
    console.error('Error:', err.message);
  }
}

processFiles();
```

---

### 3️⃣ Reading Multiple Files

```javascript
const fs = require('fs').promises;

async function readMultipleFiles() {
  try {
    const [file1, file2, file3] = await Promise.all([
      fs.readFile('file1.txt', 'utf8'),
      fs.readFile('file2.txt', 'utf8'),
      fs.readFile('file3.txt', 'utf8')
    ]);

    console.log('File 1:', file1);
    console.log('File 2:', file2);
    console.log('File 3:', file3);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

readMultipleFiles();
```

---

## 🌍 Real-World Examples

### Example 1: Simple Logger

```javascript
const fs = require('fs');

class Logger {
  constructor(logFile) {
    this.logFile = logFile;
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const entry = `[${timestamp}] INFO: ${message}\n`;
    fs.appendFileSync(this.logFile, entry);
  }

  error(message) {
    const timestamp = new Date().toISOString();
    const entry = `[${timestamp}] ERROR: ${message}\n`;
    fs.appendFileSync(this.logFile, entry);
  }
}

const logger = new Logger('app.log');
logger.log('Application started');
logger.error('Something went wrong');
```

---

### Example 2: Configuration File Reader

```javascript
const fs = require('fs');

function loadConfig(configPath) {
  try {
    const data = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error loading config:', err.message);
    return null;
  }
}

const config = loadConfig('config.json');
console.log('Config:', config);
```

---

### Example 3: File Backup System

```javascript
const fs = require('fs');
const path = require('path');

function backupFile(filePath) {
  const timestamp = Date.now();
  const ext = path.extname(filePath);
  const name = path.basename(filePath, ext);
  const dir = path.dirname(filePath);

  const backupPath = path.join(dir, `${name}_backup_${timestamp}${ext}`);

  fs.copyFile(filePath, backupPath, (err) => {
    if (err) {
      console.error('Backup failed:', err.message);
      return;
    }
    console.log(`Backup created: ${backupPath}`);
  });
}

backupFile('important-data.txt');
```

---

### Example 4: Directory Scanner

```javascript
const fs = require('fs');
const path = require('path');

function scanDirectory(dirPath, indent = '') {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  entries.forEach(entry => {
    if (entry.isDirectory()) {
      console.log(`${indent}📁 ${entry.name}/`);
      scanDirectory(path.join(dirPath, entry.name), indent + '  ');
    } else {
      const stats = fs.statSync(path.join(dirPath, entry.name));
      console.log(`${indent}📄 ${entry.name} (${stats.size} bytes)`);
    }
  });
}

scanDirectory('.');
```

---

### Example 5: CSV File Reader

```javascript
const fs = require('fs');

function parseCSV(filePath) {
  const data = fs.readFileSync(filePath, 'utf8');
  const lines = data.trim().split('\n');
  const headers = lines[0].split(',');

  const records = lines.slice(1).map(line => {
    const values = line.split(',');
    const record = {};
    headers.forEach((header, index) => {
      record[header.trim()] = values[index]?.trim();
    });
    return record;
  });

  return records;
}

const users = parseCSV('users.csv');
console.log(users);
```

---

## 📋 Best Practices

### 1. **Prefer Asynchronous Methods**

```javascript
// ✅ Good: Non-blocking
fs.readFile('file.txt', 'utf8', callback);

// ❌ Avoid: Blocking
const data = fs.readFileSync('file.txt', 'utf8');
```

---

### 2. **Always Handle Errors**

```javascript
// ✅ Good: Error handling
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error:', err.message);
    return;
  }
  // Process data
});
```

---

### 3. **Use Streams for Large Files**

```javascript
// ✅ Good: Streams for large files
const stream = fs.createReadStream('huge-file.txt');

// ❌ Bad: Loading entire file
const data = fs.readFileSync('huge-file.txt');
```

---

### 4. **Check File Existence Before Operations**

```javascript
// ✅ Good: Check first
if (fs.existsSync(filePath)) {
  fs.unlinkSync(filePath);
}
```

---

### 5. **Use Path Module for File Paths**

```javascript
const path = require('path');

// ✅ Good: Cross-platform paths
const filePath = path.join(__dirname, 'data', 'file.txt');

// ❌ Bad: Hardcoded paths
const filePath = '/data/file.txt';
```

---

## 🎤 Interview Questions

### Q1: What is the fs module in Node.js?
**Answer:** The fs module is a core Node.js module for performing file and directory operations. It provides both synchronous and asynchronous methods for reading, writing, appending, renaming, and deleting files.

---

### Q2: Difference between readFile and readFileSync?
**Answer:**
- `readFile()`: Asynchronous, non-blocking, uses callback
- `readFileSync()`: Synchronous, blocking, returns data directly

---

### Q3: Why are asynchronous methods preferred?
**Answer:** Asynchronous methods are non-blocking, meaning they don't halt the execution of other code while performing I/O operations. This makes the application more performant and scalable.

---

### Q4: What are streams and when to use them?
**Answer:** Streams are used to handle large files efficiently by processing data in chunks rather than loading the entire file into memory. Use streams when dealing with large files or when you want to process data as it arrives.

---

### Q5: What is the difference between writeFile and appendFile?
**Answer:**
- `writeFile()`: Creates new file or overwrites existing content
- `appendFile()`: Adds data to the end of the file, creates if doesn't exist

---

## 📝 Summary (Perfect for Exams)

> **The fs module is a core Node.js module for performing file and directory operations. It supports both synchronous and asynchronous methods for reading, writing, appending, renaming, deleting files, and managing directories. Asynchronous file operations are preferred because they are non-blocking. For large files, streams should be used to handle data efficiently.**

### Key Takeaways:
✅ Core module - no installation required
✅ Async methods are non-blocking (preferred)
✅ Sync methods block the event loop
✅ Use streams for large files
✅ Error-first callback pattern
✅ fs.promises for async/await
✅ Always handle errors

---

## 🎯 Quick Reference

```javascript
const fs = require('fs');

// Read
fs.readFile('file.txt', 'utf8', callback);
fs.readFileSync('file.txt', 'utf8');

// Write
fs.writeFile('file.txt', 'content', callback);
fs.writeFileSync('file.txt', 'content');

// Append
fs.appendFile('file.txt', 'more content', callback);

// Delete
fs.unlink('file.txt', callback);

// Rename
fs.rename('old.txt', 'new.txt', callback);

// Directory
fs.mkdir('folder', callback);
fs.readdir('.', callback);
fs.rmdir('folder', callback);

// Stats
fs.stat('file.txt', callback);
fs.existsSync('file.txt');

// Streams
fs.createReadStream('file.txt');
fs.createWriteStream('file.txt');
```

---

## 📚 Related Topics

1. **Path Module**
2. **Streams in Node.js**
3. **Buffer in Node.js**
4. **Working with JSON**
5. **Error Handling**

---

## 🔗 Resources

- [Node.js fs Documentation](https://nodejs.org/api/fs.html)
- [Node.js Path Module](https://nodejs.org/api/path.html)
- [Working with Files in Node.js](https://nodejs.dev/learn/the-nodejs-fs-module)

---

**Happy Learning! 🎉**

*Last Updated: 2024*
