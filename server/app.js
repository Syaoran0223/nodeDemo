// 引入模块
const express = require('express')
const nunjucks = require('nunjucks')
const bodyParser = require('body-parser')
const session = require('cookie-session')
const fs = require('fs')
const {log} = require('./utils/utils')
const { appId, appSecret, secretKey } = require('./config')
const app = express()

// 配置 bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true,
}))

// 引入路由文件
const routeIndex = require('./routes/index')
const wechatIndex = require('./routes/wechat')

// 设置路由
app.use('/', routeIndex)
app.use('/wx', wechatIndex)


// 运行服务器
const server = app.listen(port = 3555, function() {
	const host = server.address().address
	const port = server.address().port
	console.log("应用实例，访问地址为 http://%s:%s", host, port)
})

// 设置 socket 监听 server
const io = require('socket.io').listen(server)

io.on('connection', function() {
	log('新用户连接成功')
})





