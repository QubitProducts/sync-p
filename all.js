var promise = require('./index')
module.exports = function all (values) {
  return promise(function (resolve, reject) {
    var l
    var counter = l = values && values.length
    if (!counter) return resolve(values)
    while (l--) loop(values[l], l)
    function loop (val, l) {
      if (val && typeof val.then === 'function') return val.then(function decrement (val) {
        values[l] = val
        --counter || resolve(values)
      }, reject)
      --counter || resolve(values)
    }
  })
}
