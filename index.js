module.exports = function promise (resolver) {
  var waiting = { res: [], rej: [] }
  var reject = api(false)
  var resolve = api(true, reject)
  var p = { 'then': then, 'catch': function thenCatch (onReject) {
    return then(null, onReject)
  }}
  try { resolver(resolve, reject) } catch (e) {
    p.status = false
    p.value = e
  }
  return p

  function api (status, reject) {
    return function end (val) {
      if (typeof p.status !== 'undefined') return
      if (val === p) throw new Error('Error: recurses! infinite promise chain detected')
      if (status && val) try { if ('then' in val) return val.then(resolve, reject) } catch (e) {}
      p.status = status
      p.value = val
      flush()
    }
  }

  function then (onResolve, onReject) {
    return chain(onResolve, onReject)
  }

  function chain (onResolve, onReject) {
    return promise(function (resolve, reject) {
      waiting.res.push(handleNext(onResolve))
      waiting.rej.push(handleNext(onReject))
      flush()
      function handleNext (handler) {
        return function next (value) {
          try {
            value = handler ? handler(value) : value
            if (p.status) return resolve(value)
            return onReject ? resolve(value) : reject(value)
          } catch (err) { reject(err) }
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
