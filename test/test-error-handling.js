/* globals describe it */
var expect = require('chai').expect
var Promise = require('../extra')
var sinon = require('sinon')

describe('error handling', function () {
  it('should reject when an error is thrown in the resolver', function (done) {
    var error = new Error('error')
    return Promise(function (resolve, reject) {
      throw new Error('error')
    })
    .catch(function (err) {
      expect(err).to.eql(error)
      done()
    })
  })
  it('should reject when an error is thrown in the resolve hander of an unfulfilled promise', function () {
    var err = new Error('error')
    var stub = sinon.stub()
    var p = Promise.defer()
    p.promise.then(function () { throw err }).catch(stub)
    p.resolve()
    expect(stub.calledWith(err)).to.equal(true)
  })
  it('should reject when an error is thrown in the resolve hander of a resolved promise', function () {
    var err = new Error('error')
    var stub = sinon.stub()
    var p = Promise.defer()
    p.resolve()
    p.promise.then(function () { throw err }).catch(stub)
    expect(stub.calledWith(err)).to.equal(true)
  })
  it('should reject when an error is thrown in the reject hander of an about to be rejected promise', function () {
    var err = new Error('error')
    var stub = sinon.stub()
    var p = Promise.defer()
    p.promise.then(null, function () { throw err }).catch(stub)
    p.reject()
    expect(stub.calledWith(err)).to.equal(true)
  })
  it('should reject when an error is thrown in the reject hander of a rejected promise', function () {
    var err = new Error('error')
    var stub = sinon.stub()
    var p = Promise.defer()
    p.reject()
    p.promise.then(null, function () { throw err }).catch(stub)
    expect(stub.calledWith(err)).to.equal(true)
  })
  it('should handle crazy multiple promise threads', function () {
    var err = new Error('error')
    var p1 = Promise.defer()
    var p2 = p1.promise.then(function () { throw err })
    var p3 = p1.promise.then(function (val) { return val + 1 })
    var onRejected = sinon.stub()
    var stub = sinon.stub()
    p2.catch(onRejected).then(function () { return p3 }).then(stub)
    p1.resolve('blah')
    expect(onRejected.calledWith(err)).to.eql(true)
    expect(stub.calledWith('blah1')).to.eql(true)
  })
})
