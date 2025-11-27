const fs = require('fs');

const writeStream = fs.createWriteStream('./UNIT1/stream/output.txt');

writeStream.write("Hello ");
writeStream.write("World");
writeStream.end();

writeStream.on('finish', () => {
    console.log("Finished writing");
});
