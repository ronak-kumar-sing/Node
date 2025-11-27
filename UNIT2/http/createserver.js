const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end("Hello, World!\n");
  console.log(req.url);
console.log(req.method);
console.log(req.headers);

})


server.listen(4000, () => {
  console.log("server running on port 4000");
})


