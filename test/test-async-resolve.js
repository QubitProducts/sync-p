/* globals describe it Promise */
var expect = require('chai').expect
var sinon = require('sinon')
var promise = require('../index')

describe('async resolve', function () {
  it('should resolve values', function (done) {
    return promise(function (resolve) {
      setTimeout(function () {
        resolve(123)
      }, 0)
    })
    .then(function (val) {
      expect(val).to.eql(123)
      done()
    })
  })
  it('should be chainable', function (done) {
    return promise(function (resolve) {
      setTimeout(function () {
        resolve(123)
      }, 0)
    })
    .then(function () {
      return 234
    })
    .then(function (chained) {
      expect(chained).to.eql(234)
      done()
    })
  })
  it('should be really chainable', function (done) {
    return promise(function (resolve) {
      setTimeout(function () {
        resolve(123)
      }, 0)
    })
    .then(null, null)
    .then(function () {
      return 234
    })
    .then(function (chained) {
      expect(chained).to.eql(234)
      done()
    })
  })
  it('should not change once resolved', function (done) {
    return promise(function (resolve) {
      setTimeout(function () {
        resolve(123)
        resolve(234)
      }, 0)
    })
    .then(function (val) {
      expect(val).to.eql(123)
      done()
    })
  })
  it('should not call catch or reject', function (done) {
    var stub = sinon.stub()
    return promise(function (resolve) {
      setTimeout(function () {
        resolve(123)
      }, 0)
    })
    .catch(stub)
    .then(null, stub)
    .then(function () {
      expect(stub.called).to.eql(false)
      done()
    })
  })

  // requires native Promise api
  if (typeof Promise === 'undefined') return
  it('should resolve promises', function (done) {
    return promise(function (resolve) {
      setTimeout(function () {
        resolve(Promise.resolve(123))
      }, 0)
    })
    .then(function (val) {
      expect(val).to.eql(123)
      done()
    })
  })
  it('should be compatible with the native promise api', function (done) {
    return Promise.all([promise(function (resolve) {
      setTimeout(function () {
        resolve(123)
      }, 0)
    })])
    .then(function (resolved) {
      expect(resolved).to.eql([123])
      done()
    })
  })
})
