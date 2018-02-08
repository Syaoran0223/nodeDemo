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
		encoding: 'utf-8'
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
// 假数据
const addData = () => {
	let data = [
		{
			username: '小红',
			userId: 'OeyI9UQen-7wQ9bgAAAH',
			waitStatus: false,
			score: 200,
			ready: false,
		},
		{
			username: '老王',
			userId: 'OeyI9UQen-7wQ9bgAAAM',
			waitStatus: false,
			score: 150,
			ready: false,
		},
		{
			username: '小明',
			userId: 'TnJbXN8j2hn3dK8fAAAZ',
			waitStatus: false,
			score: 300,
			ready: false,
		},
	]
	for (var i = 0; i < data.length; i++) {
		var u = data[i]
		userList.addUser(u)
	}
}
// 查看用户是否登录
app.post('/loginStatus', async (req, res) => {
	// log('debug list ---------')
	// userList.log()
	// log('debug list ---------')
	res.send('11')
})
let usocket = {}
let user = [];

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
		usocket[username] = socket;
		user.push(username);
		// 将用户加入准备列表
		userData = {
			username: res,
			userId: socket.id,
			waitStatus: true,
			ready: false,
		}
		const loginStatus = userList.findSelf(userData)
		// 已经登录的话断开这次连接
		// if(loginStatus == true ) {
		// 	io.sockets.connected[userData.userId].disconnect(true)
		// 	return
		// }

		// userList.log()
		// 将玩家加入准备列表
		log('userData', userData)
		userList.addUser(userData)

		// 查找等待列表中除自己以外的玩家
		let equal = userList.findUser(userData) || false
		// userList.log()
		// 发送查找结果给前端 若为 false 则显示未匹配到对手
		io.sockets.connected[userData.userId].emit('applyResult', equal)
		if(equal == false ) {

		}
		// 找到用户信息后加入房间
		if(equal != false) {
			log('返回的对手数据', equal)
			// io.sockets.connected[userData.userId].emit('applyResult', equal)
			// io.sockets.connected[equal.userId].emit('applyResult', equal)
			socket.broadcast.emit('applyResult', equal);
			userList.ready(userData)
			userList.ready(equal)
			// userList.log()
			// 创建房间号
			let roomNumber = roomInfo.createRoom()
			// 将房间号发给指定用户加入房间
			io.sockets.connected[userData.userId].emit('room', roomNumber)
			// 暂时没有对手 模拟数据无法发送 测试时使用
			log('debug connceted', io.sockets.connected)
			io.sockets.connected[equal.userId].emit('room', roomNumber)
			// 监听用户进入s房间
			socket.on('join', function(roomId) {
				// socket.join(roomId)
				io.sockets.connected[userData.userId].join(roomId)
				io.sockets.connected[equal.userId].join(roomId)
				io.to(roomId).emit(roomId, `恭喜你加入了${roomId}`)
				// 监听指定房间信息
				socket.in(roomId).on('init', function(res) {
					//模拟对手数据
					io.sockets.connected[userData.userId].on('init', function(res) {
						console.log('init res', res)
						log('debug 每个连接的数量', io.eio.clientsCount)
						log('debug 查看所有连接', socket.nsp.connected )

					})
					// equal.ready = true
					// userData.ready = res.ready
				})
				// socket.in(roomId).on('')
			})
		}
	})
	socket.on('disconnect', function(res) {
		// 用户离开后从列表删除
		log('用户离开了')
		userList.removeUser(userData)
		// userList.cancel()
		// userList.log()
	})

})


module.exports = {
	io,
	// roomInfo
	userList,
}

