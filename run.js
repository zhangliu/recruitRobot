import Nightmare from 'nightmare'

const nm = Nightmare({show: true})

async function run() {
	await nm.goto('http://www.baidu.com')
}

run()
