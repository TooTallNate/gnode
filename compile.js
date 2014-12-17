
var regenerator_version = require('regenerator/package.json').version;
var regenerator = require('regenerator');
var version = require('../package.json').version;
var crypto = require('crypto');
var path = require('path');
var os = require('os');
var fs = require('fs');
var tmpdir = os.tmpdir ? os.tmpdir() : os.tmpDir();

module.exports = compile;

/**
 * Compile a js file with caching.
 *
 * @api private
 */

function compile(content) {
  var includeRuntime = 'object' !== typeof regeneratorRuntime;
  var filename = path.join(tmpdir, hash(content, includeRuntime) + '.js');
  try {
    return fs.readFileSync(filename, 'utf8');
  } catch (err) {
    if ('ENOENT' !== err.code) throw err;
  }
  content = regenerator.compile(content, {
    includeRuntime: includeRuntime
  }).code;
  fs.writeFileSync(filename, content);
  return content;
}

/**
 * Hash each file based on:
 *
 * - The version of regenerator.
 * - The version of gnode.
 * - Whether the runtime will be included.
 * - The content of the file itself.
 *
 * @api private
 */

function hash(content) {
  return crypto.createHash('sha256')
    .update(version)
    .update('-')
    .update(regenerator_version)
    .update('-')
    .update(+includeRuntime)
    .update('-')
    .update(content)
    .digest('hex');
}
