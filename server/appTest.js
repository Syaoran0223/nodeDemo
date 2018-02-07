// 引入模块
const express = require('express')
const nunjucks = require('nunjucks')
const bodyParser = require('body-parser')
const session = require('cookie-session')
const fs = require('fs')
const _ = require('lodash')
const {log} = require('./utils/utils')
const {appId, appSecret, secretKey} = require('./config')
const redisClient = require('./redisConfig')
const socketRoom = require('./models/socketRoom')
const app = express()


// 配置 bodyParser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended: true,
}))

// 引入路由文件
const routeIndex = require('./routes/index')
const wechatIndex = require('./routes/wechat')

// 设置路由
app.use('/', routeIndex)
app.use('/wx', wechatIndex)

//
// 运行服务器
var server = app.listen(port = 3666, function() {
	const host = server.address().address
	const port = server.address().port
	console.log('应用实例，访问地址为 http://%s:%s', host, port)
})

// 设置 socket 监听 server
const io = require('socket.io').listen(server)


// 全局变量 - 用户列表  之后用数据库代替
const userList = require('./models/userList')
// 全局变量 - 房间列表
const roomInfo = {
	group1: [
		{
			'小红': 'OeyI9UQen-7wQ9bgAAAB',
		},

	],
}
io.sockets.on('connection', function(socket) {
	let userId = socket.id
	let roomId
	let userData = ''
	//	监听用户连接 记录已准备的用户
	socket.on('applBattle', function(res) {
		// 将用户加入准备列表
		userData = {
			username: res,
			userId: socket.id,
		}
		log('userData', userData)
		// 将玩家加入准备列表
		userList.addUser(userData)
		// 查找等待列表中除自己以外的玩家
		let equal = userList.findUser(userData) || false
		// 如果为 undefined 则告诉用户没有匹配到对手
		log('equal', equal)
		socket.emit('applyResult', equal)

	})
	socket.on('disconnect', function(res) {
		// 用户离开后从列表删除
		userList.removeUser(userData)
	})

})


module.exports = {
	io,
	// roomInfo
}

