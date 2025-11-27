const fs = require('fs');

// Use recursive: true to avoid error if folder already exists
fs.mkdir('newFolder', { recursive: true }, (err) => {
  if (err) throw err;
  console.log('Folder created successfully!');
});

