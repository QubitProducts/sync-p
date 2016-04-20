/* globals describe it Promise */
var expect = require('chai').expect
var promise = require('../index')

describe('error handling', function () {
  it('should reject on error', function (done) {
    return promise(function (resolve, reject) {
      throw new Error('error')
    })
    .catch(function (err) {
      expect(err.message).to.eql('error')
      done()
    })
  })
  it('should reject on error with chained .catch', function (done) {
    return promise(function (resolve) {
      resolve('blah')
    })
    .then(function (val) {
      throw new Error('error')
    })
    .catch(function (err) {
      expect(err.message).to.eql('error')
      done()
    })
  })
  it('should reject on error with chained .then', function (done) {
    return promise(function (resolve) {
      resolve('blah')
    })
    .then(function (val) {
      throw new Error('error')
    })
    .then(null, function (val) {
      expect(val.message).to.eql('error')
      done()
    })
  })
  it('should handle crazy multiple promise threads', function (done) {
    var p = promise(function (resolve) {
      resolve('blah')
    })
    var p2 = p.then(function (val) {
      throw new Error('error')
    })
    var p3 = p.then(function (val) {
      return val + '1'
    })
    p2.then(null, function (err) {
      expect(err.message).to.eql('error')
      return p3
    })
    .then(function (val) {
      expect(val).to.eql('blah1')
      done()
    })
  })
  it('should handle resolving after the fact', function (done) {
    var value = 123
    var _resolve
    promise(function (resolve, reject) {
      _resolve = resolve
    })
    .then(function () {
      throw new Error('error')
    })
    .then(null, function (err) {
      expect(err.message).to.eql('error')
      done()
    })
    _resolve(value)
  })
  it('should handle null', function () {
    return promise(function (resolve, reject) {
      resolve(123)
    })
    .then(function () {
      throw null
    })
    .catch(function (e) {
      expect(e).to.eql(null)
    })
  })
})
