
/**
 * A lot of this entry file is based off of node's src/node.js.
 */

var regenerator = require('regenerator');
var path = require('path');
var childProcess = require('child_process');
var fallbackScriptPath = process.argv[1];

// grab a reference to the entry point script, then clean up the env
var entryPoint = process.env.GNODE_ENTRY_POINT;
delete process.env.GNODE_ENTRY_POINT;

// load the custom `.js` ES6 Generator compiler
require('./index.js');

// we hook child_process.fork so it can handle modules that contain generator syntax
var originalFork = childProcess.fork;
childProcess.fork = function(modulePath, args, options) {
  options = options || {};
  options.env = options.env || process.env;
  // the passed moudle will be the entry point
  options.env.GNODE_ENTRY_POINT = modulePath;

  // we set the module path to fallback.js so it can compile the entry point
  modulePath = fallbackScriptPath;

  var child = originalFork.apply(this, arguments);
  delete options.env.GNODE_ENTRY_POINT;
  return child;
};

// if the cluster module is loaded, then cluster.fork would use the un-hooked
// version of child_process.fork, we don't want that so invalidate the cache
// and re-load it
if (require.cache['cluster']) {
  delete require.cache['cluster'];
  require('cluster');
}

if (process._eval != null) {
  // User passed '-e' or '--eval' arguments to Node.
  evalScript('[eval]');
} else if (entryPoint) {
  // we replace fallback.js (the value in process.argv[1]) with the entry point
  // and re-run Module.runMain() so it will load it
  process.argv[1] = path.resolve(entryPoint);
  require('module').runMain();
  // undo the replacment
  process.argv[1] = fallbackScriptPath;
} else {
  // run the REPL, or run from stdin

  // If -i or --interactive were passed, or stdin is a TTY.
  if (process._forceRepl || require('tty').isatty(0)) {
    // REPL
    var opts = {
      'eval': gnodeEval,
      useGlobal: true,
      ignoreUndefined: false
    };
    if (parseInt(process.env.NODE_NO_READLINE, 10)) {
      opts.terminal = false;
    }
    if (parseInt(process.env.NODE_DISABLE_COLORS, 10)) {
      opts.useColors = false;
    }
    var repl = require('module').requireRepl().start(opts);
    repl.on('exit', function() {
      process.exit();
    });

  } else {
    // Read all of stdin - execute it.
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    var code = '';
    process.stdin.on('data', function(d) {
      code += d;
    });

    process.stdin.on('end', function() {
      process._eval = code;
      evalScript('[stdin]');
    });
  }
}

// custom eval() function for the REPL, that first compiles
function gnodeEval (code, context, file, fn) {
  var err, result;
  try {
    // compile JS via facebook/regenerator
    code = regenerator.compile(code, {
      includeRuntime: 'object' !== typeof regeneratorRuntime
    }).code;
  } catch (e) {
    // Treat regenerator errors as syntax errors in repl.
    // A hack to have repl interpret certain js structures correctly.
    e.name = 'SyntaxError'
    err = e;
  }
  try {
    if (this.useGlobal) {
      result = vm.runInThisContext(code, file);
    } else {
      result = vm.runInContext(code, context, file);
    }
  } catch (e) {
    err = e;
  }

  fn(err, result);
}

// copied (almost) directly from joyent/node's src/node.js
function evalScript (name) {
  var Module = require('module');
  var cwd = process.cwd();

  var module = new Module(name);
  module.filename = path.join(cwd, name);
  module.paths = Module._nodeModulePaths(cwd);
  var script = process._eval;

  // compile JS via facebook/regenerator
  script = regenerator.compile(script, {
    includeRuntime: 'object' !== typeof regeneratorRuntime
  }).code;

  if (!Module._contextLoad) {
    var body = script;
    script = 'global.__filename = ' + JSON.stringify(name) + ';\n' +
             'global.exports = exports;\n' +
             'global.module = module;\n' +
             'global.__dirname = __dirname;\n' +
             'global.require = require;\n' +
             'return require("vm").runInThisContext(' +
             JSON.stringify(body) + ', ' +
             JSON.stringify(name) + ', true);\n';
  }

  var result = module._compile(script, name + '-wrapper');
  if (process._print_eval) console.log(result);
}
