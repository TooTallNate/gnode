
/**
 * This cli.js test file tests the `gnode` wrapper executable via
 * `child_process.spawn()`. Generator syntax is *NOT* enabled for these
 * test cases.
 */

var path = require('path');
var assert = require('assert');
var spawn = require('child_process').spawn;

// node executable
var node = process.execPath || process.argv[0];
var gnode = path.resolve(__dirname, '..', 'bin', 'gnode');

describe('gnode CLI', function () {

  this.slow(1000);
  this.timeout(2000);

  cli([ '-v' ], 'should output the version number', function (child, done) {
    buffer(child.stdout, function (err, data) {
      // TODO: use "semver" module to test for realz
      assert('v' == data[0]);
      done();
    });
  });

  cli([ '--help' ], 'should output the "help" display', function (child, done) {
    buffer(child.stdout, function (err, data) {
      assert(/^Usage\: node/.test(data));
      done();
    });
  });

  //cli([ ], '', function (child, done) {
  //});

});


function cli (argv, name, fn) {
  describe(argv.join(' '), function () {
    it(name, function (done) {
      var child = spawn(node, [ gnode ].concat(argv));
      fn(child, done);
    });
  });
}

function buffer (stream, fn) {
  var buffers = '';
  stream.setEncoding('utf8');
  stream.on('data', ondata);
  stream.on('end', onend);
  stream.on('error', onerror);

  function ondata (b) {
    buffers += b;
  }
  function onend () {
    stream.removeListener('error', onerror);
    fn(null, buffers);
  }
  function onerror (err) {
    fn(err);
  }
}
