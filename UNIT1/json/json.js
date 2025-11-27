const fs = require('fs');

fs.readFile('./UNIT1/json/data.json', 'utf8', (err, data) => {
  if (err) throw err;
  const jsonData = JSON.parse(data);
  console.log(jsonData);
})