const fs = require('fs');

const timeAppend = (message)=>{
  const timestamp = new Date().toISOString();
  const logEntry = `[ ${timestamp} ] ${message}\n`;

  fs.appendFile('./UNIT1/fs/output.txt', logEntry, 'utf-8', (err) => {
    if (err) throw err;
    console.log('log Ertry added');
  })
}

timeAppend('application stated');
timeAppend('User logged in');
timeAppend('processing data');
