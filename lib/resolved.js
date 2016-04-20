var promise = require('../index')
module.exports = function resolved (value) {
  return promise(function (resolve) {
    resolve(value)
  })
}
