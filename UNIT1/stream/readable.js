const fs = require('fs');

const readStream = fs.createReadStream('./UNIT1/stream/input.txt', 'utf8');

readStream.on('data', (chunk) => {
  console.log('New chunk received:');
  console.log(chunk);
})

readStream.on('end',() => {
  console.log('No more data to read.');
})

readStream.on('error', (err) => {
  console.error('Error while reading the file:', err);
})