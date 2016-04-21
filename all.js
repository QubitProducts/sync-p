var promise = require('./index')
module.exports = function all (values) {
  values = values.slice(0)
  return promise(function (resolve, reject) {
    var counter = values.length
    var l = values && values.length
    if (!l) return resolve(values)
    while (l--) get(values[l], l)

    function get (val, l) {
      values[l] = val
      if (val && typeof val === 'object' && val.then) return val.then(swap, reject)
      if (!--counter) return resolve(values)
      function swap (newVal) {
        get(newVal, l)
      }
    }
  })
}
