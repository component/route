
# route

  Route implementation for client-side routers.

## Installation

    $ component install component/route

## API

### Route(path)

  Initialize a `Route` with a `path` string or regexp.

### Route#setup(fn)

  Assign setup `fn` used when the "page" is shown.

### Route#teardown(fn)

  Assign teardown `fn` used to perform cleanup when
  an alternate "page" is shown.

### Route#match(path)

  Match against the given `path`. Returns `false` or
  an array with params matched.

## Examples

```js
var route = new Route('/user/:id/posts/:pid');

assert(false == route.match('/something'));
assert(false == route.match('/user/123'));

var ret = route.match('/user/12/posts/1');
assert('12' == ret.id);
assert('1' == ret.pid);
```

should support wildcards.

```js
var route = new Route('/file/*');
var ret = route.match('/file/js/jquery.js');
assert('js/jquery.js' == ret[0]);
```

should pass through regexps.

```js
var route = new Route(/^\/foo/);
assert(route.match('/foo'));
assert(false == route.match('/bar'));
```

should ignore querystrings.

```js
var route = new Route('/user/:id/posts/:pid');

assert(false == route.match('/something?hey'));

var ret = route.match('/user/12/posts/1?something=here');
assert('12' == ret.id);
assert('1' == ret.pid);
```

should decode the params.

```js
var route = new Route('/user/:name');
var ret = route.match('/user/tj%20holowaychuk');
assert('tj holowaychuk' == ret.name);
```

## License

  MIT
