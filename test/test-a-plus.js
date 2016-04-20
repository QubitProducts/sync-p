// // some of the spec is intentionally avoided, e.g.
// // a) the lib is capable of returning syncronously, i.e. it does not defer everything
// // b) to avoid bloat, the lib assumes non falsey args to be functions
//
// var resolved = require('../lib/resolved')
// var rejected = require('../lib/rejected')
// var deferred = require('../lib/deferred')
// var adapter = {
//   resolved: resolved,
//   rejected: rejected,
//   deferred: deferred
// }
// describe("Promises/A+ Tests", function () {
//   require("promises-aplus-tests").mocha(adapter)
// })
