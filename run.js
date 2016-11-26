import nightmare from 'nightmare'
import config from './config'
import runHelper from './libs/runHellper'
import email from './libs/email'
import fs from 'fs'
let nm = null
const POST_TITLE = '【北京/杭州】智课网，寻找优秀的你！18K~36K，年终奖2-4个月，丰厚期权！'

const run = async () => {
  nm = nightmare({
    show: true,
    waitTimeout: config.nightmare.waitTimeout,
    webPreferences: {
      images: false,
    },
  })
  try {
    await runHelper.runTimes(login, config.run.times, config.run.timeout)
    console.log('登录成功')
  } catch (e) {
    await nm.end()
    console.log('登录失败')
    email.sendMail('[recruit robot]: 登录失败')
  }
  await nm.goto('https://cnodejs.org/?tab=job')
  let post = null
  try {
    const getPostWithPrarms = getPost.bind(null, POST_TITLE)
    // const getPostWithPrarms = getPost.bind(null, 'cnode有做敏感词过滤吗')
    post = await runHelper.runTimes(getPostWithPrarms, config.run.times, config.run.timeout)
    console.log(`获取帖子${post}成功`)
  } catch (e) {
    await nm.end()
    console.log('获取帖子失败')
    // email.sendMail('[recruit robot]: 获取帖子失败')
  }

  if (post) {
    try {
      const replyPostWithPrarms = replyPost.bind(null, post)
      await runHelper.runTimes(replyPostWithPrarms, config.run.times, config.run.timeout)
      console.log('回复帖子成功')
      await nm.end()
      email.sendMail('[recruit robot]: 回复帖子成功')
      return
    } catch (e) {
      await nm.end()
      console.log('回复帖子失败')
      email.sendMail('[recruit robot]: 回复帖子失败')
      return
    }
  }

  try {
    await runHelper.runTimes(createPost, config.run.times, config.run.timeout)
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

const getPost = async (title) => {
  const selector = `.topic_title[title="${title}"]`
  console.log(`尝试获取帖子${selector}`);
  await nm.wait(selector)
  return selector
}

const replyPost = async (selector) => {
  await nm.click(selector)
  console.log(`点击了${selector}`)
  await nm.wait('#reply_form')
  console.log(`检测到回复表单`);
  const url = await nm.url()
  await nm.evaluate(() => {
    var textarea = $(document.querySelector('#reply_form textarea.editor'))
    var editor = textarea.data('editor')
    var cm = editor.codemirror
    cm.focus();
    editor.push('顶，每日一顶！欢迎大家踊跃投简历哈！')
    document.querySelector('#reply_form .editor_buttons input').click()
  })
  let waitTimes = 10
  while (url === await nm.url()) {
    await nm.wait(1000)
    if (waitTimes-- <= 0) {
      return false
    }
  }
  console.log(`检测到url发生了变化！`);
  await nm.wait('#reply_form')
  console.log(`检测到回复表单，说明回复成功！`);
  return true
}

const createPost = async () => {
  await nm.goto('https://cnodejs.org/topic/create')
  await nm.wait('#create_topic_form')
  await nm.select('#tab-value', 'job')
  await nm.type('#title', POST_TITLE)
  const content = await new Promise((resolve) => {
    fs.readFile('./cnodejs_post.txt', (err, data) => {
      if (err) {
        resolve(null)
      }
      resolve(data.toString())
    })
  })
  await nm.evaluate(postContent => {
    var editor = new Editor();
    editor.render(document.querySelector('.markdown_in_editor textarea.editor'))
    var cm = editor.codemirror
    cm.focus();
    editor.push(postContent)
    document.querySelector('#create_topic_form .editor_buttons input').click()
  }, content)
}

const alwaysRun = async () => {
  setTimeout(() => {
    run().then(() => {
      alwaysRun()
    })
  }, 5 * 60 * 60 * 1000)
}
run().then(() => {
  alwaysRun()
}).catch(() => {
  alwaysRun()
})
