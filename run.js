import nightmare from 'nightmare'
import config from './config'
import runHelper from './libs/runHellper'
import email from './libs/email'

const nm = nightmare({show: true})

async function run() {
  try {
    await runHelper.runTimes(login, 3, 5 * 60 * 1000)
    console.log('登录成功！');
  } catch (e) {
    console.log('登录失败！')
    email.sendMail('[recruit robot]: 登录失败')
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

run()
