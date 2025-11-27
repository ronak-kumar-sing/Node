const express = require('express');
const app = express();
const port = 3000;

// Middleware function to log request details


app.use((req, res, next) => {
  console.log(`${req.method} request for '${req.url}'`);
  next();
})

// authentication middleware
app.use((req, res, next) => {
  const auth = req.headers['authorization'];
  console.log('Authorization Header:', auth);
  if (auth === 'mysecrettoken') {
    next();
  } else {
    res.status(403).send('Forbidden');
  }
});

app.get('/protected', (req, res) => {
  res.send('This is a protected route');
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});