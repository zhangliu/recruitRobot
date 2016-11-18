const base64 = require('base-64')
export default {
  username: 'zhangliuge@yeah.net',
  password: base64.decode('emhhbmdsaXVoanVpdmMw'),
  nightmare: {
    waitTimeout: 60000,
  },
  run: {
    times: 5,
    timeout: 5 * 60 * 1000,
  },
  email: {
    sender: {
      host: 'smtp.exmail.qq.com',
      port: 465,
      secure: true, // use SSL
      auth: {
        user: 'zhangyunnian@innobuddy.com',
        pass: base64.decode('emhhbmdsaXVJbm5vYnVkZHkw'),
      },
    },
    receivers: [
      'zhangyunnian@innobuddy.com',
    ],
  },
}
