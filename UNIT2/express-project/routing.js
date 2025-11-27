const express = require('express');
const app = express();
const PORT = 3000;


app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.get('/about', (req, res) => {
  res.send('Your are on about');
})

app.get('/home', (req, res) => {
  res.send('Home page ');
})

app.use((req, res) => {
  res.send('Page Not Found!');
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})