const EventEmitter = require('events');
const emitter = new EventEmitter();

emitter.on('greet', (name , age) => {
  console.log(`Welcome ${name}, age ${age}`); // Corrected spelling
});

emitter.emit('greet', 'John', 30);
