const fs = require('fs');
module.exports = [
  {
    type: 'nodejs',
    title: '【北京*滴滴出行】招聘web前端工程师，20-40k',
    jp: fs.readFileSync(`${__dirname}/webfront_jp.txt`).toString()
  }
]