const http = require('http')

const server = http.createServer();

server.on('request', (req, res) => {
  console.log('Hlo ronak');
  // res.send('whatsapp!');
  res.end('hello');
})

server.listen(4000, ()=> {
  console.log('Server is running on 4000');
})