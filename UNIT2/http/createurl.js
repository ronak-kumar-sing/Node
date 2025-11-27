const http = require('http');


const server = http.createServer((req, res) => {
  if (req.url === '/home') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end("Welcome to the Home Page!\n");
  }
  else if (req.url === '/about') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end("This is the About Page.\n");
  }
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end("Page not found.\n");
  }
})

server.listen(4000, () => {
  console.log("server running on port 4000");
})