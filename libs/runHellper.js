const runTimes = async (func, times = 3, timeout = 20000) => {
  for (let i = 0; i < times; i++) {
    try {
      return await runTimeout(func, timeout)
    } catch (e) { }
  }
  throw new Error(`运行${times}次后仍然超时！`)
}

const runTimeout = async (func, timeout = 20000) => {
  return await Promise.race([
    func(),
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('运行超时！'))
      }, timeout)
    }),
  ])
}

module.exports = {
  runTimes,
}
