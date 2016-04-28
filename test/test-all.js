/* globals describe it */
var expect = require('chai').expect
var Promise = require('../extra')

describe('all', function () {
  describe('when called with an empty array', function () {
    it('should return immediately', function () {
      var values = []
      var result
      Promise.all(values).then(function (val) {
        result = val
      })
      expect(result).to.eql(values)
    })
  })
  describe('when called with just values', function () {
    it('should return immediately', function () {
      var values = [1, 2, 3]
      var result
      Promise.all(values).then(function (val) {
        result = val
      })
      expect(result).to.eql(values)
    })
  })
  describe('when called with a mixture of values and promises', function () {
    it('should resolve the promises and return only values', function (done) {
      var d = Promise.defer()
      var values = [1, 2, Promise.resolve(3), d.promise]
      Promise.all(values).then(function (val) {
        expect(val).to.eql([1, 2, 3, 4])
        done()
      })
      d.resolve(4)
    })
  })
  describe('error', function () {
    it('should reject the promise', function (done) {
      var values = [1, 2, Promise.reject('error')]
      Promise.all(values).catch(function (err) {
        expect(err).to.eql('error')
        done()
      })
    })
  })
})
