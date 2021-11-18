var promise = require('./index')
promise.resolve = require('./resolve')

module.exports = function any (values) {
  function flip (p) {
    return promise(function (resolve, reject) {
      promise.resolve(p).then(reject, resolve)
    })
  }
  return flip(promise(function (resolve, reject) {
    var l
    var counter = l = values && values.length
    if (!counter) return reject(values)
    for (var i = 0; i < l; i++) { loop(values[i], i) }
    function loop (val, l) {
      if (val && typeof val.then === 'function') {
        return flip(val.then(reject, function decrement (val) {
          values[l] = val
          --counter || resolve(values)
        }))
      }
      reject(val)
    }
  }))
}
