const express = require('express')
const nunjucks = require('nunjucks')
const bodyParser = require('body-parser')
const session = require('cookie-session')
const fs = require('fs')

// 先初始化一个 express 实例
const app = express()

// 设置 bodyParser
app.use(bodyParser.urlencoded({
	extended: true,
}))

// 配置 nunjucks 模板, 第一个参数是模板文件的路径
nunjucks.configure('templates', {
	autoescape: true,
	express: app,
})


const run = (port=3000, host='') => {
	// app.listen 方法返回一个 http.Server 对象, 这样使用更方便
	// 实际上这个东西的底层是我们以前写的 net.Server 对象
	const server = app.listen(port, host, () => {
		// 非常熟悉的方法
		const address = server.address()
		host = address.address
		port = address.port
		log(`listening server at http://${host}:${port}`)
	})
}

if (require.main === module) {
	const port = 4000
	// host 参数指定为 '0.0.0.0' 可以让别的机器访问你的代码
	const host = '0.0.0.0'
	run(port, host)
}