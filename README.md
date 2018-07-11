# sync-p
A tiny sync promise lib

## features
sync-p is 52 lines of code, but handles the majority of the promise spec. Some of the spec is intentionally avoided, e.g.
- sync-p is capable of returning synchronously, i.e. it does not defer everything
- to avoid bloat sync-p assumes that truthy args passed to .then are functions (strict adherence involves explicitly handling cases like .then(5) ...like, just don't do that, that's not the api)
- it does not throw if a promise is rejected and no reject handler is attached

## installation
```
npm install sync-p
```

## usage
```js
var Promise = require('sync-p')

var result
var p = new Promise(function (resolve, reject) {
    // resolve immediately
    resolve(true)
  })
  .then(null, null)
  .then(function (val) {
    result = val
  })
console.log(result) // true

new Promise(function (resolve, reject) {
  throw 'error'
})
.catch(function (err) {
  console.log(err) // 'error'
})

var p = new Promise(function (resolve, reject) {
  setTimeout(function () {
    resolve(true)
  }, 0)
})
.then(onSuccess, onError)

var all = require('sync-p/all')

var p = all([1, 2, promise3]).then(function (val) {
  console.log(val) // [1, 2, 3]
})

// ... etc.
```


## extra
```js
var Promise = require('sync-p/extra')

// includes all, resolve, reject and defer
var promise = Promise.all(array)
var resolved = Promise.resolve(123)
var rejected = Promise.reject(321)
var deferred = Promise.defer()
var race = Promise.race(array)
```

## run tests
```
npm test
```


## Want to work on this for your day job?

This project was created by the Engineering team at Qubit. As we use open source libraries, we make our projects public where possible.

We’re currently looking to grow our team, so if you’re a JavaScript engineer and keen on ES2016 React+Redux applications and Node micro services, why not get in touch? Work with like minded engineers in an environment that has fantastic perks, including an annual ski trip, yoga, a competitive foosball league, and copious amounts of yogurt.

Find more details on our Engineering site. Don’t have an up to date CV? Just link us your Github profile! Better yet, send us a pull request that improves this project.`
Contact GitHub API Training Shop Blog About
