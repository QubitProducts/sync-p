/* globals describe it Promise */
var expect = require('chai').expect
var promise = require('../index')
var all = require('../all')

describe('all', function () {
  describe('empty array', function () {
    it('should return immediately', function () {
      var values = []
      var result
      all(values).then(function (val) {
        result = val
      })
      expect(result).to.eql(values)
    })
  })
  describe('only values', function () {
    it('should return immediately', function () {
      var values = [1, 2, 3]
      var result
      all(values).then(function (val) {
        result = val
      })
      expect(result).to.eql(values)
    })
  })
  describe('values and promises', function () {
    it('should replace promised values with the values themselves', function (done) {
      var values = [1, 2, later(3)]
      return all(values).then(function (val) {
        expect(val).to.eql([1, 2, 3])
        done()
      })
    })
  })
  describe('error', function () {
    it('should reject the promise', function (done) {
      var values = [1, 2, later('error', true)]
      return all(values).catch(function (val) {
        expect(val).to.eql('error')
        done()
      })
    })
  })
})

function later (val, shouldReject) {
  return promise(function (resolve, reject) {
    setTimeout(function () {
      if (shouldReject) return reject(val)
      resolve(val)
    }, 0)
  })
}
