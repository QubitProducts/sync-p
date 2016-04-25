// /* globals describe it beforeEach */
// var expect = require('chai').expect
// var resolved = require('../resolved')
// var rejected = require('../rejected')
//
// describe('2.3.3', function () {
//   var numberOfTimesThenWasRetrieved = null
//
//   beforeEach(function () {
//     numberOfTimesThenWasRetrieved = 0
//   })
//
//   it('via return from a fulfilled promise', function (done) {
//     var p = resolved(1).then(function onBasePromiseFulfilled () {
//       return Object.create(null, {
//         then: {
//           get: function () {
//             ++numberOfTimesThenWasRetrieved
//             return function thenMethodForX (onFulfilled) {
//               onFulfilled()
//             }
//           }
//         }
//       })
//     })
//
//     p.then(function () {
//       expect(numberOfTimesThenWasRetrieved).to.eql(1)
//       done()
//     })
//   })
//
//   it('via return from a rejected promise', function (done) {
//     var p = rejected(1).then(null, function onBasePromiseRejected () {
//       return Object.create(null, {
//         then: {
//           get: function () {
//             ++numberOfTimesThenWasRetrieved
//             return function thenMethodForX (onFulfilled) {
//               onFulfilled()
//             }
//           }
//         }
//       })
//     })
//
//     p.then(function () {
//       expect(numberOfTimesThenWasRetrieved).to.eql(1)
//       done()
//     })
//   })
// })
