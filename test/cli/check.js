
var assert = require('assert');

// assert up here to ensure that hoisting works as expected
assert('gen' == gen.name);
assert('GeneratorFunction' == gen.constructor.name);

function *gen () {}

var g = gen();
//console.error(g.constructor + '');
//assert('Generator' == g.constructor.name);
assert('function' == typeof g.next);
assert('function' == typeof g.throw);
