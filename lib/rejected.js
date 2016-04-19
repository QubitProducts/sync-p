var promise = require('../index')
module.exports = function rejected (value) {
  return promise(function (resolve, reject) {
    reject(value)
  })
}
