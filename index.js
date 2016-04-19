module.exports = function promise (resolver) {
  var status, value
  var waiting = { onResolve: [], onReject: [] }
  try { resolver(api(true), api(false)) } catch (e) {
    status = false
    value = e
  }
  var p = { 'then': registerThen, 'catch': registerCatch }
  return p

  function registerThen (onResolve, onReject) {
    if (!onResolve && !onReject) return p
    if (!onResolve && status === true) return p
    if (!onReject && status === false) return p
    return chain(onResolve, onReject)
  }

  function registerCatch (onReject) {
    return registerThen(null, onReject)
  }

  function api (newStatus) {
    return function resolve (val) {
      if (typeof status !== 'undefined') return
      status = newStatus
      value = val
      flush()
    }
  }

  function chain (onResolve, onReject) {
    return promise(function (resolve, reject) {
      waiting.onResolve.push(handleNext(onResolve, true))
      waiting.onReject.push(handleNext(onReject))
      flush()
      function handleNext (handler, depromisify) {
        return function next (value) {
          if (depromisify && typeof value === 'object' && value.then) return value.then(next)
          try { resolve(handler ? handler(value) : value) } catch (err) {
            reject(err)
          }
        }
      }
    })
  }

  function flush (onResolve, onReject) {
    if (typeof status === 'undefined') return
    var queue = status ? waiting.onResolve : waiting.onReject
    while (queue.length) queue.shift()(value)
  }
}
