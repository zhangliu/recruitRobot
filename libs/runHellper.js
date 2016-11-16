const runTimes = async (func, times, timeout = 20000) => {
  for (let i = 0; i < times; i++) {
    console.log(`尝试运行第${i}次`);
    try {
      await runTimeout(func, timeout)
      return
    } catch (e) {
      console.log(e.message)
    }
  }
  throw new Error(`运行${times}次后仍然超时！`)
}

const runTimeout = async (func, timeout = 20000) => {
  return await Promise.race([
    func(),
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('运行超时！'));
      }, timeout);
    }),
  ]);
}

export default {
  runTimes,
}
