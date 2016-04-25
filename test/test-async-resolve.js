/* globals describe it */
var expect = require('chai').expect
var sinon = require('sinon')
var Promise = require('../extra')

describe('async resolve', function () {
  it('should call resolve', function () {
    var stub = sinon.stub()
    var d = Promise.defer()
    d.promise.then(stub)
    d.resolve(123)
    expect(stub.calledWith(123)).to.eql(true)
  })
  it('should not call reject', function () {
    var stub = sinon.stub()
    var d = Promise.defer()
    d.promise.then(null, stub)
    d.resolve(123)
    expect(stub.called).to.eql(false)
  })
  it('should not call catch', function () {
    var stub = sinon.stub()
    var d = Promise.defer()
    d.promise.catch(stub)
    d.resolve(123)
    expect(stub.called).to.eql(false)
  })
  it('should be really chainable', function () {
    var stub = sinon.stub()
    var d = Promise.defer()
    d.promise
      .then(null, null)
      .then(function () { return 234 })
      .then(stub)
    d.resolve(123)
    expect(stub.calledWith(234)).to.eql(true)
  })
  it('should be really really chainable', function () {
    var resolvedStub = sinon.stub()
    var rejectedStub = sinon.stub()
    var d = Promise.defer()
    d.promise
      .then(null, rejectedStub)
      .then(resolvedStub, null)
    d.resolve(123)
    expect(rejectedStub.called).to.eql(false)
    expect(resolvedStub.calledWith(123)).to.eql(true)
  })
  it('should not change once resolved', function () {
    var stub = sinon.stub()
    var d = Promise.defer()
    d.resolve(123)
    d.resolve(234)
    d.promise.then(stub)
    expect(d.promise.value).to.eql(123)
  })
  it('should resolve promises', function () {
    var p = Promise.resolve(123)
    var stub = sinon.stub()
    var d = Promise.defer()
    d.promise.then(stub)
    d.resolve(p)
    expect(stub.calledWith(123)).to.eql(true)
  })
})
