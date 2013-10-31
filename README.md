gnode
=====
### Run node with ES6 Generators

`gnode` is a very light wrapper around your `node` executable that ensures ES6
Generator support, either through V8's native support (via the
`--harmony_generators` flag when necessary, node >= v0.11.3), or falling back to
[`facebook/regenerator`][regenerator] emulation when no native support is
available (node < v0.11.3).


Installation
------------

Install the `gnode` executable via npm:

``` bash
$ npm install -g gnode
```


CLI Examples
------------

The `gnode` executable uses whatever version of node is installed in your `PATH`:

Here's our example `t.js` file:

``` js
var co = require('co');

function sleep (ms) {
  return function (fn) {
    setTimeout(fn, ms);
  };
}

co(function* () {
  for (var i = 0; i < 5; i++) {
    console.log(i);
    yield sleep(1000);
  }
})();
```

This script with an ES6 Generator in it can be run using any version of node
by using `gnode`:

``` bash
☮ ~ (master) ∴ n 0.8.26

☮ ~ (master) ∴ gnode -v
v0.8.26

☮ ~ (master) ∴ gnode t.js
0
1
2
3
4

☮ ~ (master) ∴ n 0.10.21

☮ ~ (master) ∴ gnode -v
v0.10.21

☮ ~ (master) ∴ gnode t.js
u
0
1
2
3
4

☮ ~ (master) ∴ n 0.11.8

☮ ~ (master) ∴ gnode -v
v0.11.8

☮ ~ (master) ∴ gnode t.js
0
1
2
3
4
```


Programmatic API
----------------

You can also just `require('gnode')` in a script _without any generators_, and
then `require()` any other .js file that has generators after that.

``` js
require('gnode');
var gen = require('./someGenerator');
// etc…
```

[regenerator]: https://github.com/facebook/regenerator
