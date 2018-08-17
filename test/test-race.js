/* globals describe it */
var expect = require('chai').expect
var Promise = require('../extra')

describe('race', function () {
  describe('when called with an empty array', function () {
    it('should never resolve', function () {
      var values = []
      var isResolved = false
      Promise.race(values).then(function (val) {
        isResolved = true
      })
      expect(isResolved).to.eql(false)
    })
  })
  describe('when called with just values', function () {
    it('should resolve immediately with first value', function () {
      var values = [1, 2, 3]
      var result
      Promise.race(values).then(function (val) {
        result = val
      })
      expect(result).to.eql(1)
    })
  })
  describe('when called with a mixture of values and promises', function () {
    it('should resolve immediately with first value', function (done) {
      var d = Promise.defer()
      var values = [1, 2, Promise.resolve(3), d.promise]
      Promise.race(values).then(function (val) {
        expect(val).to.eql(1)
        done()
      })
      d.resolve(4)
    })
  })
  describe('when called with a mixture of promises and values with a promise at the start', function () {
    it('should resolve immediately with first promise', function (done) {
      var values = [Promise.resolve(1), 2]
      Promise.race(values).then(function (val) {
        expect(val).to.eql(1)
        done()
      })
    })
  })
  describe('when called with only promises', function () {
    it('should resolve immediately with first promise', function (done) {
      var values = [Promise.resolve(1), Promise.resolve(2)]
      Promise.race(values).then(function (val) {
        expect(val).to.eql(1)
        done()
      })
    })
  })
  describe('when called with a delayed first promise', function () {
    it('should resolve immediately with second promise', function (done) {
      var d = Promise.defer()
      var values = [d.promise, Promise.resolve(2)]
      Promise.race(values).then(function (val) {
        expect(val).to.eql(2)
        done()
      })
      d.resolve(1)
    })
  })
  describe('error', function () {
    it('should reject the promise', function (done) {
      var values = [Promise.reject('error'), 2, 3]
      Promise.race(values).catch(function (err) {
        expect(err).to.eql('error')
        done()
      })
    })
  })
})
