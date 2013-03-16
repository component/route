
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
  this._before = [];
  this._after = [];
}

/**
 * Add before `fn`.
 *
 * @param {Function} fn
 * @return {Route} self
 * @api public
 */

Route.prototype.before = function(fn){
  this._before.push(fn);
  return this;
};

/**
 * Add after `fn`.
 *
 * @param {Function} fn
 * @return {Route} self
 * @api public
 */

Route.prototype.after = function(fn){
  this._after.push(fn);
  return this;
};

/**
 * Invoke callbacks for `type` with `args`.
 *
 * @param {String} type
 * @param {Array} args
 * @api public
 */

Route.prototype.call = function(type, args){
  args = args || [];
  var fns = this['_' + type];
  if (!fns) throw new Error('invalid type');
  for (var i = 0; i < fns.length; i++) {
    fns[i].apply(null, args);
  }
};

/**
 * Check if `path` matches this route,
 * returning `false` or an object.
 *
 * @param {String} path
 * @return {Object}
 * @api public
 */

Route.prototype.match = function(path){
  var keys = this.keys;
  var qsIndex = path.indexOf('?');
  var pathname = ~qsIndex ? path.slice(0, qsIndex) : path;
  var m = this.regexp.exec(pathname);
  var params = [];
  var args = [];

  if (!m) return false;

  for (var i = 1, len = m.length; i < len; ++i) {
    var key = keys[i - 1];

    var val = 'string' == typeof m[i]
      ? decodeURIComponent(m[i])
      : m[i];

    if (key) {
      params[key.name] = undefined !== params[key.name]
        ? params[key.name]
        : val;
    } else {
      params.push(val);
    }

    args.push(val);
  }

  params.args = args;
  return params;
};
