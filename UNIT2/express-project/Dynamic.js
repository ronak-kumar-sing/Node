const express = require('express');
const app = express();

const PORT = 3000;

app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  res.send(`User ID is ${userId}`);
})

app.get('/data/:date/:mouth/:year', (req, res) => {
  const {date , mouth, year} = req.params;
  res.send(`Date is ${date}, Month is ${mouth}, Year is ${year}`);
}
);

app.get('/:age', (req, res) => {
  const age = req.params.age;
  res.send(`Age is ${age}`);
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})