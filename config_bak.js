const Base64 = require('js-base64').Base64

module.exports = {
  username: '',
  password: Base64.decode(''),
  nightmare: {
    waitTimeout: 60000,
  },
  run: {
    times: 3,
    timeout: 5 * 60 * 1000,
  },
  email: {
    sender: {
      // host: 'smtp.exmail.qq.com',
      host: 'smtp.yeah.net',
      port: 465,
      secure: true, // use SSL
      auth: {
        user: '',
        pass: '',
      },
    },
    receivers: [
      '',
    ],
  },
}
