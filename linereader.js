var lineReader = require('line-reader');

lineReader.eachLine('tokens', function(line, last, cb) {
  console.log(line);

  if (last) {
    cb(false); // stop reading
  } else {
    cb();
  }
});