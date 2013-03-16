
/**
 * Module dependencies.
 */

var toRegexp = require('path-to-regexp');

/**
 * Expose `Route`.
 */

module.exports = Route;

/**
 * Initialize a route with the given `path`.
 *
 * @param {String|Regexp} path
 * @return {Type}
 * @api public
 */

function Route(path) {
  this.path = path;
  this.keys = [];
  this.regexp = toRegexp(path, this.keys);
  this.callbacks = {};
}

/**
 * Assign setup `fn`.
 *
 * @param {Function} fn
 * @return {Route} self
 * @api public
 */

Route.prototype.setup = function(fn){
  this.callbacks.setup = fn;
  return this;
};

/**
 * Assign teardown `fn`.
 *
 * @param {Function} fn
 * @return {Route} self
 * @api public
 */

Route.prototype.teardown = function(fn){
  this.callbacks.teardown = fn;
  return this;
};

/**
 * Check if `path` matches this route,
 * returning `false` or an array of matches.
 *
 * @param {String} path
 * @return {Array}
 * @api public
 */

Route.prototype.match = function(path){
  var keys = this.keys;
  var qsIndex = path.indexOf('?');
  var pathname = ~qsIndex ? path.slice(0, qsIndex) : path;
  var m = this.regexp.exec(pathname);
  var obj = [];

  if (!m) return false;

  for (var i = 1, len = m.length; i < len; ++i) {
    var key = keys[i - 1];

    var val = 'string' == typeof m[i]
      ? decodeURIComponent(m[i])
      : m[i];

    if (key) {
      obj[key.name] = undefined !== obj[key.name]
        ? obj[key.name]
        : val;
    } else {
      obj.push(val);
    }
  }

  return obj;
};
