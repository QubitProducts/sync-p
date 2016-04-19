/* globals describe it Promise */
var expect = require('chai').expect
var sinon = require('sinon')
var promise = require('../index')

describe('reject', function () {
  it('should resolve values', function (done) {
    return promise(function (resolve, reject) {
      reject(123)
    })
    .then(null, function (val) {
      expect(val).to.eql(123)
      done()
    })
  })
  it('should be chainable', function (done) {
    return promise(null, function (resolve, reject) {
      reject(123)
    })
    .then(null, function () {
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
    .then(null, function () {
      return 234
    })
    .then(function (chained) {
      expect(chained).to.eql(234)
      done()
    })
  })
  it('should be really really chainable', function (done) {
    return promise(function (resolve, reject) {
      reject(123)
    })
    .then(function () {}, null)
    .then(null, function () {
      done()
    })
  })
  it('should not change once rejected', function (done) {
    return promise(function (resolve, reject) {
      reject(123)
      reject(234)
    })
    .then(null, function (val) {
      expect(val).to.eql(123)
      done()
    })
  })
  it('should not call resolve', function (done) {
    var stub = sinon.stub()
    return promise(function (resolve, reject) {
      reject(123)
    })
    .then(stub, function () {})
    .then(function () {
      expect(stub.called).to.eql(false)
      done()
    })
  })

  // requires native Promise api
  if (typeof Promise === 'undefined') return
  it('should not resolve promises', function (done) {
    return promise(function (resolve, reject) {
      reject(Promise.resolve(123))
    })
    .then(null, function (val) {
      expect(typeof val).to.eql('object')
      done()
    })
  })
  it('should be compatible with the native promise api', function (done) {
    return Promise.all([promise(function (resolve, reject) {
      reject(123)
    })])
    .then(null, function (reason) {
      expect(reason).to.eql(123)
      done()
    })
  })
})
