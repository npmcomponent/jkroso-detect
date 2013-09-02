
# detect

  find the first item within an array that passes a predicate test. (async, sync, or series)

## Installation

_With [component](//github.com/component/component), [packin](//github.com/jkroso/packin) or [npm](//github.com/isaacs/npm)_  

	$ {package mananger} install jkroso/detect

then in your app:

```js
var detect = require('detect')
var series = require('detect/series')
var async = require('detect/async')
```

## API

### detect(array, pred, ctx)

  find the first item that passes the `pred` test

### series(array, pred, ctx)

  As above except it understands [Results](//github.com/jkroso/result) and therefore can be used for async tasks. It can accept results both as parameters and return values from `pred`.

### async(array, pred, ctx)

  Same as `series` except it doesn't care for which position the result is in it will just return the first to pass in terms of time

## Running the tests

```bash
$ make
```

Then open your browser to the `./test` directory.