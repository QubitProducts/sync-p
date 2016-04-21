module.exports = function promise (resolver) {
  var waiting = { res: [], rej: [] }
  var p = { 'then': then, 'catch': thenCatch }
  var reject = api(false)
  var resolve = api(true, reject)
  try { resolver(resolve, reject) } catch (e) {
    p.status = false
    p.value = e
  }
  return p

  function api (status, reject) {
    return function end (val) {
      if (typeof p.status !== 'undefined') return
      if (val === p) throw new Error('TypeError: recurses! infinite promise chain detected')
      if (status && val && typeof val === 'object' && val.then) return val.then(resolve, reject)
      p.status = status
      p.value = val
      flush()
    }
  }

  function then (onResolve, onReject) {
    if (!onResolve && !onReject) return p
    if (!onResolve && p.status === true) return p
    if (!onReject && p.status === false) return p
    return chain(onResolve, onReject)
  }

  function thenCatch (onReject) {
    return then(null, onReject)
  }

  function chain (onResolve, onReject) {
    return promise(function (resolve, reject) {
      waiting.res.push(handleNext(onResolve))
      waiting.rej.push(handleNext(onReject))
      flush()
      function handleNext (handler) {
        return function next (value) {
          try { resolve(handler ? handler(value) : value) } catch (err) { reject(err) }
        }
      }
    })
  }

  function flush (onResolve, onReject) {
    if (typeof p.status === 'undefined') return
    var queue = p.status ? waiting.res : waiting.rej
    while (queue.length) queue.shift()(p.value)
  }
}
