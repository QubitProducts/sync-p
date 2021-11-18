var Promise = require('./index')
Promise.resolve = require('./resolve')

module.exports = function race (values) {
  return Promise(function (resolve, reject) {
    var counter = values && values.length
    if (!counter) return

    for (var i = 0; i < counter; i++) {
      Promise.resolve(values[i]).then(resolve, reject)
    }
  })
}
