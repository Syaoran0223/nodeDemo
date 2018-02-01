const express = require('express')
const nunjucks = require('nunjucks')
const bodyParser = require('body-parser')
const session = require('cookie-session')
const fs = require('fs')
const {log} = require('./utils/utils')
const { secretKey } = require('./config')
// 先初始化一个 express 实例
const app = express()

// 设置 bodyParser
app.use(bodyParser.urlencoded({
	extended: true,
}))

// 设置 session
app.use(session({
	secret: secretKey,
}))

// 配置 nunjucks 模板, 第一个参数是模板文件的路径
nunjucks.configure('templates', {
	autoescape: true,
	express: app,
})
// 引入路由文件
const routeIndex = require('./routes/index')
// 设置路由
app.use('/', routeIndex)

// 套路
const run = (port = 3000, host = '') => {
	const server = app.listen(port, host, () => {
		const address = server.address()
		host = address.address
		port = address.port
		log(`listening server at http://${host}:${port}`)
	})
}

if (require.main === module) {
	const port = 4000
	const host = '0.0.0.0'
	run(port, host)
}