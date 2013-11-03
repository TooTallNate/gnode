
var assert = require('assert');

// assert up here to ensure that hoising works as expected
assert('gen' == gen.name);
assert('GeneratorFunction' == gen.constructor.name);

function *gen () {}

var g = gen();
assert('Generator' == g.constructor.name);
