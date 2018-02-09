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
// 返回html 页面
const sendHtml = function(path, response) {
	const fs = require('fs')
	const options = {
		encoding: 'utf-8',
	}
	fs.readFile(path, options, function(err, data) {
		response.send(data)
	})
}
app.get('/', function(req, res) {
	const path = 'index.html'
	sendHtml(path, res)
})
// 设置路由
// app.use('/', routeIndex)
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

// 全局变量 - 题库
const Question = require('./question')
// 全局变量 - 用户列表  之后用数据库代替
const UserList = require('./userList')
const userList = new UserList()
// 全局变量 - 房间列表
// const roomInfo = {
// 	group1: [
// 		{
// 			'小红': 'OeyI9UQen-7wQ9bgAAAB',
// 		},
//
// 	],
// }
const RoomInfo = require('./roomInfo')
const roomInfo = new RoomInfo()
// // 假数据
// const addData = () => {
// 	let data = [
// 		{
// 			username: '小红',
// 			userId: 'OeyI9UQen-7wQ9bgAAAH',
// 			waitStatus: false,
// 			score: 200,
// 			ready: false,
// 		},
// 		{
// 			username: '老王',
// 			userId: 'OeyI9UQen-7wQ9bgAAAM',
// 			waitStatus: false,
// 			score: 150,
// 			ready: false,
// 		},
// 		{
// 			username: '小明',
// 			userId: 'TnJbXN8j2hn3dK8fAAAZ',
// 			waitStatus: false,
// 			score: 300,
// 			ready: false,
// 		},
// 	]
// 	for (var i = 0; i < data.length; i++) {
// 		var u = data[i]
// 		userList.addUser(u)
// 	}
// }
// 查看用户是否登录
app.post('/loginStatus', async(req, res) => {
	// log('debug list ---------')
	// userList.log()
	// log('debug list ---------')
	res.send('11')
})
let usocket = {}
let user = []

io.sockets.on('connection', function(socket) {
	socket.removeAllListeners()
	let userId = socket.id
	let roomId
	let userData

	//	监听用户连接 记录已准备的用户
	// addData()
	socket.on('applyBattle', function(res) {
		let username = res
		socket.username = res
		usocket[username] = socket
		user.push(username)
		// 将用户加入准备列表
		userData = {
			username: res,
			userId: socket.id,
			waitStatus: true,
			ready: false,
		}
		const loginStatus = userList.findSelf(userData)
		// 将玩家加入准备列表
		userList.addUser(userData)

		// 查找等待列表中除自己以外的玩家
		let equal = userList.findUser(userData) || false
		// userList.log()
		// 发送查找结果给前端 若为 false 则显示未匹配到对手
		if (equal == false) {
			io.sockets.connected[userData.userId].emit('applyResult', equal)
		}
		// 找到用户信息后加入房间
		if (equal != false) {
			// log('返回的对手数据', equal)
			io.sockets.connected[userData.userId].emit('applyResult', equal)
			io.sockets.connected[equal.userId].emit('applyResult', userData)
			// socket.broadcast.emit('applyResult', equal);
			// 创建房间号
			let roomNumber = roomInfo.createRoom(userData, equal)
			if (roomNumber == false) {
				io.sockets.connected[userData.userId].emit('applyResult', '匹配失败')
				io.sockets.connected[equal.userId].emit('applyResult', '匹配失败')
				return
			}
			// 将房间号发给指定用户加入房间
			io.sockets.connected[userData.userId].emit('room', roomNumber)
			io.sockets.connected[equal.userId].emit('room', roomNumber)
			// 监听用户进入房间
			io.sockets.connected[userData.userId].on('join', function(roomId) {
				io.sockets.connected[userData.userId].join(roomId)
				io.sockets.connected[userData.userId].emit(roomId, `恭喜你加入了${roomId}`)

			})
			io.sockets.connected[equal.userId].on(roomId, function(roomId) {
				io.sockets.connected[equal.userId].join(roomId)
				io.sockets.connected[equal.userId].emit(roomId, `恭喜你加入了${roomId}`)
			})
			// io.to(roomId).emit(roomId, `恭喜你加入了${roomId}`)
			// 加入房间后将等待状态改为false
			// userList.waitFalse(equal)
			// userList.waitFalse(userData)
			// 答题状态
			let userQuestionStatus = false
			let equalQuestionStatus = true
			io.sockets.connected[userData.userId].on('chooseReady', function(res) {
				log(`${userData.usernamen}答题结果 ${res}`)
				userQuestionStatus = true
				while (userQuestionStatus == true &&  equalQuestionStatus == true ) {
					// 发送新题目
					log('收到答题')
					userQuestionStatus = false
				}
			})
			io.sockets.connected[equal.userId].on('chooseReady', function(res) {
				log(`${equal.usernamen}答题结果 ${res}`)
				equalQuestionStatus = true
			})


		}
		socket.on('disconnect', function(res) {
			// 用户离开后从列表删除
			log('用户离开了', res)
			socket.leave('group0')
			userList.removeUser(userData)
			userList.cancelAll()
			// userList.log()
		})
	})


})


module.exports = {
	io,
	// roomInfo
	userList,
}

