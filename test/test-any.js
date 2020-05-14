/* globals describe it */
var expect = require('chai').expect
var Promise = require('../extra')

describe('any', function () {
  describe('when called with an empty array', function () {
    it('should return immediately', function () {
      var values = []
      var result
      Promise.any(values).then(function (val) {
        result = val
      })
      expect(result).to.eql(values)
    })
  })
  describe('when called with just values', function () {
    it('should return immediately', function () {
      var values = [1, 2, 3]
      var result
      Promise.any(values).then(function (val) {
        result = val
      })
      expect(result).to.eql(1)
    })
  })
  describe('when called with a mixture of values and promises', function () {
    it('should resolve to the first value in the array', function (done) {
      var d = Promise.defer()
      var values = [d.promise, 2, 3]
      Promise.any(values).then(function (val) {
        expect(val).to.eql(2)
        done()
      })
      d.resolve(1)
    })
  })
  describe('when called with a mixture of values and promises that resolve and reject', function () {
    it('should resolve returning the first value', function (done) {
      var d = Promise.defer()
      var e = Promise.defer()
      var error1 = new Error('eek1')
      var error2 = new Error('eek2')
      var values = [d.promise, Promise.reject(error2), e.promise, 4]
      Promise.any(values).then(function (val) {
        expect(val).to.eql(4)
        done()
      })
      d.reject(error1)
      e.resolve(3)
    })
  })
  describe('when called with a mixture of promises that resolve and reject', function () {
    it('should resolve returning the first promise value', function (done) {
      var d = Promise.defer()
      var e = Promise.defer()
      var error1 = new Error('eek1')
      var error2 = new Error('eek2')
      var error4 = new Error('eek4')
      var values = [d.promise, Promise.reject(error2), e.promise, Promise.reject(error4)]
      Promise.any(values).then(function (val) {
        expect(val).to.eql(3)
        done()
      })
      d.reject(error1)
      e.resolve(3)
    })
  })
  describe('when called with all promises that reject', function () {
    it('should fail when all fail', function (done) {
      var d = Promise.defer()
      var error1 = new Error('eek1')
      var error2 = new Error('eek2')
      var error3 = new Error('eek3')
      var error4 = new Error('eek4')
      var values = [d.promise, Promise.reject(error2), Promise.reject(error3), Promise.reject(error4)]
      Promise.any(values).catch(function (err) {
        expect(err).to.eql([error1, error2, error3, error4])
        done()
      })
      d.reject(error1)
    })
  })
})
