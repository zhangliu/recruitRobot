const nightmare = require('nightmare')
const config = require('../../config')
const runHelper = require('../../libs/runHellper')
const email = require('../../libs/email')
const ytx = require('../../companys/ytx')

const jobs = [ytx[0]]
let nm = null

const run = async () => {
  nm = nightmare({
    show: true,
    waitTimeout: config.nightmare.waitTimeout,
    webPreferences: { images: false },
  })
  try {
    await runHelper.runTimes(login, config.run.times, config.run.timeout)
    console.log('登录成功')
  } catch (e) {
    await nm.end()
    console.log('登录失败')
    email.sendMail('[recruit robot]: 登录失败')
  }

  for (const job of jobs) {
    try {
      const func = publishJob.bind(null, job)
      await runHelper.runTimes(func, config.run.times, config.run.timeout)
    } catch (err) {
      console.log(err.message)
    }
  }

  await nm.end()
  email.sendMail('[recruit robot]: 创建帖子成功')
}

const publishJob = async job => {
  try {
    await nm.goto('https://cnodejs.org/?tab=job')
    await createPost(job)
    console.log('创建帖子成功')
    await nm.end()
    email.sendMail('[recruit robot]: 创建帖子成功')
  } catch (e) {
    await nm.end()
    console.log('创建帖子失败')
    email.sendMail('[recruit robot]: 创建帖子失败')
  }
}

const login = async () => {
  await nm.goto('https://cnodejs.org/signin')
  await nm.wait('#signin_form')
  await nm.click('.form-actions a:nth-child(2)')
  console.log('点击了按钮‘使用github账号登录’');
  const result = await Promise.race([
    nm.wait('.auth-form-body').then(() => 'auth-form-body'),
    nm.wait('#create_topic_btn').then(() => 'create_topic_btn'),
  ])
  console.log(`获取了点击‘使用github账号登录’后跳转的结果${result}`)
  if (result === 'create_topic_btn') {
    return
  }
  console.log('发现github登录表单')
  await nm.type('#login_field', config.username)
  await nm.type('#password', config.password)
  console.log('成功的填写了用户名和密码')
  await nm.click('input[name="commit"]')
  await nm.wait('#create_topic_btn')
  console.log('成功的登录并且进入到了主页')
}

const createPost = async job => {
  await nm.goto('https://cnodejs.org/topic/create')
  await nm.wait('#create_topic_form')
  await nm.select('#tab-value', 'job')
  await nm.type('#title', job.title)
  await nm.evaluate(postContent => {
    var editor = new Editor()
    editor.render(document.querySelector('.markdown_in_editor textarea.editor'))
    var cm = editor.codemirror
    cm.focus()
    editor.push(postContent)
    document.querySelector('#create_topic_form .editor_buttons input').click()
  }, job.jp)
  await nm.wait('.delete_topic_btn')
}

module.exports = {
  run,
}
