module.exports = function promise (resolver, level) {
  var p = {'then': registerThen, 'catch': registerCatch, waiting: { res: [], rej: [] }}
  try { resolver(api(true), api(false)) } catch (e) {
    p.status = false
    p.value = e
  }
  return p

  function registerThen (onResolve, onReject) {
    if (!onResolve && !onReject) return p
    if (!onResolve && p.status === true) return p
    if (!onReject && p.status === false) return p
    return chain(onResolve, onReject)
  }

  function registerCatch (onReject) {
    return registerThen(null, onReject)
  }

  function api (newStatus) {
    return function resolve (val) {
      if (typeof p.status !== 'undefined') return
      p.status = newStatus
      p.value = val
      flush()
    }
  }

  function chain (onResolve, onReject) {
    return promise(function (resolve, reject) {
      p.waiting.res.push(handleNext(onResolve, true))
      p.waiting.rej.push(handleNext(onReject))
      flush()
      function handleNext (handler, depromisify) {
        return function next (value) {
          try {
            if (value && typeof value === 'object' && value.then) if (depromisify || (value.status === false)) return value.then(next, reject)
            if (handler) return next(handler(value, handler = false))
            if (value === p) throw new Error('TypeError')
            return (typeof value === 'object' && value.then && value.status === false) ? reject(value) : resolve(value)
          } catch (err) { reject(err) }
        }
      }
    }, p.level)
  }

  function flush (onResolve, onReject) {
    if (typeof p.status === 'undefined') return
    var queue = p.status ? p.waiting.res : p.waiting.rej
    while (queue.length) queue.shift()(p.value)
  }
}
