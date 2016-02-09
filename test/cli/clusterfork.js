'use strict';

var cluster = require('cluster');

if (cluster.isMaster) {
  // master forks a worker
  var worker = cluster.fork();
  worker.on('message', function(msg) {
    // we got a message from the worker so we know it was created succefully
    console.log('cluster.fork works!');
    worker.disconnect();
    setTimeout(function() {
      worker.kill();
    }, 100);
  });
} else {
  // the worker notifies the master it's alive
  process.send({msg: "I'm alive"});
}