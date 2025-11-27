const fs = require('fs');

const content = 'Hlwo\nrow';

fs.writeFile('./UNIT1/fs/output1.txt', content, 'utf-8', (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log('file created successfully');
})

