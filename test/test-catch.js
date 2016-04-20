/* globals describe it Promise */
var expect = require('chai').expect
var promise = require('../index')

describe('catch', function () {
  it('should resolve values', function (done) {
    return promise(function (resolve, reject) {
      reject(123)
    })
    .catch(function (val) {
      expect(val).to.eql(123)
      done()
    })
  })
  it('should be chainable', function (done) {
    return promise(null, function (resolve, reject) {
      reject(123)
    })
    .catch(function () {
      return 234
    })
    .then(function (chained) {
      expect(chained).to.eql(234)
      done()
    })
  })
  it('should be really chainable', function (done) {
    return promise(function (resolve, reject) {
      reject(123)
    })
    .then(null, null)
    .catch(function () {
      return 234
    })
    .then(function (chained) {
      expect(chained).to.eql(234)
      done()
    })
  })
  it('should not change once rejected', function (done) {
    return promise(function (resolve, reject) {
      reject(123)
      reject(234)
    })
    .catch(function (val) {
      expect(val).to.eql(123)
      done()
    })
  })

  // requires native Promise api
  if (typeof Promise === 'undefined') return
  it('should not resolve promises', function (done) {
    return promise(function (resolve, reject) {
      reject(Promise.resolve(123))
    })
    .catch(function (val) {
      expect(typeof val).to.eql('object')
      done()
    })
  })
  it('should be compatible with the native promise api', function (done) {
    return Promise.all([promise(function (resolve, reject) {
      reject(123)
    })])
    .catch(function (reason) {
      expect(reason).to.eql(123)
      done()
    })
  })
})
