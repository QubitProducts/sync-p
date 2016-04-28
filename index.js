var err = new Error('Error: recurses! infinite promise chain detected')
module.exports = function promise (resolver) {
  var waiting = { res: [], rej: [] }
  var p = { 'then': then, 'catch': function thenCatch (onReject) {
    return then(null, onReject)
  }}
  try { resolver(resolve, reject) } catch (e) {
    p.status = false
    p.value = e
  }
  return p

  function then (onResolve, onReject) {
    return promise(function (resolve, reject) {
      waiting.res.push(handleNext(p, waiting, onResolve, resolve, reject, onReject))
      waiting.rej.push(handleNext(p, waiting, onReject, resolve, reject, onReject))
      if (typeof p.status !== 'undefined') flush(waiting, p)
    })
  }

  function resolve (val) {
    if (typeof p.status !== 'undefined') return
    if (val === p) throw err
    if (val) try { if (typeof val.then === 'function') return val.then(resolve, reject) } catch (e) {}
    p.status = true
    p.value = val
    flush(waiting, p)
  }

  function reject (val) {
    if (typeof p.status !== 'undefined') return
    if (val === p) throw err
    p.status = false
    p.value = val
    flush(waiting, p)
  }
}

function flush (waiting, p) {
  var queue = p.status ? waiting.res : waiting.rej
  while (queue.length) queue.shift()(p.value)
}

function handleNext (p, waiting, handler, resolve, reject, hasReject) {
  return function next (value) {
    try {
      value = handler ? handler(value) : value
      if (p.status) return resolve(value)
      return hasReject ? resolve(value) : reject(value)
    } catch (err) { reject(err) }
  }
}
