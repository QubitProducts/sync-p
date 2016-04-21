# sync-p
A tiny sync promise lib

## features
sync-p is 52 lines of code, but handles the majority of the promise spec. Some of the spec is intentionally avoided, e.g.
- sync-p is capable of returning synchronously, i.e. it does not defer everything
- to avoid bloat sync-p assumes that truthy args passed to .then are functions (strict adherence involves explicitly handling cases like .then(5) ...like, just don't do that, that's not the api)
- it doesn't handle the case where promise x is given a handler that returns promise x, causing an infinite promise recursion, because why would you ever do that

## installation
```
npm install sync-p
```

## usage
```js
var promise = require('sync-p')

var result
promise(function (resolve, reject) {
  // resolve immediately
  resolve(true)
})
.then(null, null)
.then(function (val) {
  result = val
})
console.log(result) // true

promise(function (resolve, reject) {
  throw 'error'
})
.catch(function (err) {
  console.log(err) // 'error'
})

promise(function (resolve, reject) {
  setTimeout(function () {
    resolve(true)
  }, 0)
})
.then(onSuccess, onError)

var all = require('sync-p/all')

all([1, 2, promise3]).then(function (val) {
  console.log(val) // [1, 2, 3]
})

// ... etc.
```

## run tests
```
npm test
```
