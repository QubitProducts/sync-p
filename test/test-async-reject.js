/* globals describe it */
var expect = require('chai').expect
var sinon = require('sinon')
var Promise = require('../extra')

describe('async reject', function () {
  it('should call reject', function () {
    var stub = sinon.stub()
    var d = Promise.defer()
    d.promise.then(null, stub)
    d.reject(123)
    expect(stub.calledWith(123)).to.eql(true)
  })
  it('should not call resolve', function () {
    var stub = sinon.stub()
    var d = Promise.defer()
    d.promise.then(stub, null)
    d.reject(123)
    expect(stub.called).to.eql(false)
  })
  it('should recover when caught', function () {
    var stub = sinon.stub()
    var d = Promise.defer()
    d.promise
      .then(null, function () { return 234 })
      .then(stub, null)
    d.reject(123)
    expect(stub.calledWith(234)).to.eql(true)
  })
  it('should be really chainable', function () {
    var stub = sinon.stub()
    var d = Promise.defer()
    d.promise
      .then(null, null)
      .then(null, function () {
        return 234
      })
      .then(stub)
    d.reject(123)
    expect(stub.calledWith(234)).to.eql(true)
  })
  it('should be really really chainable', function () {
    var resolvedStub = sinon.stub()
    var rejectedStub = sinon.stub()
    var d = Promise.defer()
    d.promise
      .then(resolvedStub, null)
      .then(null, rejectedStub)
    d.reject(123)
    expect(resolvedStub.called).to.eql(false)
    expect(rejectedStub.calledWith(123)).to.eql(true)
  })
  it('should not change once rejected', function () {
    var stub = sinon.stub()
    var d = Promise.defer()
    d.promise.then(null, stub)
    d.reject(123)
    d.reject(234)
    expect(d.promise.value).to.eql(123)
  })
  it('should reject an already fulfilled promise with the same reason', function () {
    var stub = sinon.stub()
    var d1 = Promise.defer()
    var d2 = Promise.defer()
    d1.promise.then(function () {
      return d2.promise
    })
    .then(null, stub)
    d1.resolve()
    d2.reject(123)
    expect(stub.calledWith(123)).to.eql(true)
  })
  it('should reject an already rejected promise from a rejected promise with the same reason', function () {
    var stub = sinon.stub()
    var d1 = Promise.defer()
    var d2 = Promise.defer()
    d1.promise.then(null, function () {
      return d2.promise
    })
    .then(null, stub)
    d1.reject()
    d2.reject(123)
    expect(stub.calledWith(123)).to.eql(true)
  })
  it('should not resolve promises', function () {
    var p = Promise.resolve(123)
    var stub = sinon.stub()
    var d = Promise.defer()
    d.promise.then(null, stub)
    d.reject(p)
    expect(stub.calledWith(p)).to.eql(true)
  })
})
