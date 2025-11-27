const http = require('http');

const data = {
  name: "John Doe",
  age: 30,
  city: "New York"
}

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
})

server.listen(4000, () => {
  console.log("server running on port 4000");
})