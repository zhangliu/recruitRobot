const fs = require('fs')

module.exports = [
  {
    type: 'nodejs',
    title: '【银天下】招聘nodejs工程师，10K-18K，美女如云',
    describe: fs.readFileSync(`${__dirname}/nodejs_jp.txt`)
  }
]