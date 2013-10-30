
/**
 * Module dependencies.
 */

var fs = require('fs');
var regenerator = require('regenerator');

/**
 * Entry point for node versions that don't have Generator support.
 *
 * This file replaces the default `.js` require.extensions implementation with
 * one that first compiles the JavaScript code via "facebook/regenerator".
 *
 * Once that is in place then it loads the original entry point .js file.
 */

require.extensions['.js'] = gnodeJsExtensionCompiler;

var compileOpts = {
  includeRuntime: true
};

function gnodeJsExtensionCompiler (module, filename) {
  var content = fs.readFileSync(filename, 'utf8');
  content = stripBOM(content);

  // compile JS via facebook/regenerator
  content = regenerator(content, compileOpts);

  // after the first regenerator() call, we can turn
  // off the `includeRuntime` option
  compileOpts.includeRuntime = false;

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
