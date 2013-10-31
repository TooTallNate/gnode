
// grab a reference to the entry point script, then clean up the env
var entryPoint = process.env.GNODE_ENTRY_POINT;
delete process.env.GNODE_ENTRY_POINT;

// load the custom `.js` ES6 Generator compiler
require('./index.js');

if (entryPoint) {
  // replace `process.argv[1]` with the expected path value,
  // and re-run Module.runMain()
  process.argv[1] = require('path').resolve(entryPoint);
  require('module').runMain();
} else {
  // run the REPL, or run from stdin
  throw new Error('REPL / stdin not supported yet!');
}
