
// load the custom `.js` ES6 Generator compiler
require('./index.js');

// replace `process.argv[1]` with the expected path value,
// and re-run Module.runMain()
process.argv[1] = require('path').resolve(process.env.GNODE_ENTRY_POINT);
require('module').runMain();
