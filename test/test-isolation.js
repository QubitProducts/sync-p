/* globals describe it beforeEach */
var expect = require('chai').expect

describe('isolation', function () {
  const modules = ['all', 'any', 'race']

  beforeEach(function () {
    delete require.cache[require.resolve('../index')]
  })

  modules.forEach((moduleName) => {
    describe(`when '${moduleName}' imported as 'sync-p/${moduleName}'`, function () {
      it('should not throw error', function () {
        delete require.cache[require.resolve(`../${moduleName}`)]
        var func = require(`../${moduleName}`)

        var values = [1, 2]
        var error = null

        func(values)
          .then()
          .catch(function (err) {
            error = err
          })

        expect(error).to.not.be.instanceOf(Error)
      })
    })
  })
})
