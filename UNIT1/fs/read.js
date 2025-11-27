const fs = require('fs');

// fs.readFile('./UNIT1/fs/data.txt', 'utf-8', (err,data) => {
//   if (err) {
//     console.log('Error Reading File', err.message);
//     return;
//   }
//   console.log('File Content: ',data);
// })

// console.log('this runs before file is read');

// * Synchronous Read(Blocking)

try {
  const data = fs.readFileSync('./UNIT1/fs/data.txt', 'utf-8');
  console.log(data);
} catch (err) {
  console.log(err);
}

console.log('this will run after this')