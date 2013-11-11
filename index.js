
/**
 * Module dependencies.
 */

var fs = require('fs');
var regenerator = require('regenerator');

/**
 * First include the regenerator runtime. It get's installed gloablly as
 * `wrapGenerator`, so we just need to make sure that global function is
 * available.
 */

require('vm').runInThisContext(regenerator('', { includeRuntime: true }));

/**
 * Entry point for node versions that don't have Generator support.
 *
 * This file replaces the default `.js` require.extensions implementation with
 * one that first compiles the JavaScript code via "facebook/regenerator".
 *
 * Once that is in place then it loads the original entry point .js file.
 */

require.extensions['.js'] = gnodeJsExtensionCompiler;

function gnodeJsExtensionCompiler (module, filename) {
  var content = fs.readFileSync(filename, 'utf8');
  content = stripBOM(content);

  // strip away the hashbang if present
  content = stripHashbang(content);

  // compile JS via facebook/regenerator
  content = regenerator(content, {
    includeRuntime: 'function' != typeof wrapGenerator
  });

  module._compile(content, filename);
}

// copied directly from joyent/node's lib/module.js
function stripBOM (content) {
  // Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
  // because the buffer-to-string conversion in `fs.readFileSync()`
  // translates it to FEFF, the UTF-16 BOM.
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

// strips away the "hashbang" from the source file if present
function stripHashbang (content) {
  if ('#!' == content.substring(0, 2)) {
    content = content.substring(content.indexOf('\n') + 1);
  }
  return content;
}
