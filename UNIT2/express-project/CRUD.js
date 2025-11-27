const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let items = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
];

app.get('/api/items', (req, res) => {
  res.json(items);
});



app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});