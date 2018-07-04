const fs = require('fs');
module.exports = [
  {
    type: 'nodejs',
    title: '【上海浦东*银天下】招聘nodejs工程师，10K-18K',
    jp: fs.readFileSync(`${__dirname}/nodejs_jp.txt`).toString()
  }
]