
// grab a reference to the entry point script, then clean up the env
var entryPoint = process.env.GNODE_ENTRY_POINT;
delete process.env.GNODE_ENTRY_POINT;

// load the custom `.js` ES6 Generator compiler
require('./index.js');

// replace `process.argv[1]` with the expected path value,
// and re-run Module.runMain()
process.argv[1] = require('path').resolve(entryPoint);
require('module').runMain();
