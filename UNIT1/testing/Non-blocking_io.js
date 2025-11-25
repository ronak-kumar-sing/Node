const fs = require('fs');

// Non-blocking file read
fs.readFile('data.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log('File content:', data);
});

console.log('This runs before file is read!');