module.exports = {
  username: 'xxxxxxxxxxxxx',
  password: 'xxxxxxxxxxxxx',
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
        user: 'xxxxxxxxxxx',
        pass: 'xxxxxxxxxxxxxxx',
      },
    },
    receivers: [
      'xxxxxxxxxxxxxxxx',
    ],
  },
}
