gnode
=====
### Run node with ES6 Generators
[![Build Status](https://travis-ci.org/TooTallNate/gnode.png?branch=master)](https://travis-ci.org/TooTallNate/gnode)

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

``` bash
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
