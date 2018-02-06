// 引入模块
const express = require('express')
const nunjucks = require('nunjucks')
const bodyParser = require('body-parser')
const session = require('cookie-session')
const fs = require('fs')
// const redis = require('redis')
const {log} = require('./utils/utils')
const {appId, appSecret, secretKey} = require('./config')
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
const sendHtml = function(path, response) {
	const fs = require('fs')
	const options = {
		encoding: 'utf-8'
	}
	fs.readFile(path, options, function(err, data) {
		response.send(data)
	})
}

// app.get('/', function(req, res) {
// 	const path = 'index.html'
// 	sendHtml(path, res)
// })
app.use('/wx', wechatIndex)

// 设置 redis
// const redisClient = redis.createClient('6379', '127.0.0.1')
// // redis 链接错误
// redisClient.on('error', function(error) {
// 	console.log('redisClient', error)
// })
// // redis 测试
// const redisInit = () => {
// 	redisClient.set('roomInfo', '1')
// 	redisClient.get('roomInfo', function(err, res) {
//
// 	})
//
// }
// redisInit()

// 运行服务器
const server = app.listen(port = 3555, function() {
	const host = server.address().address
	const port = server.address().port
	console.log('应用实例，访问地址为 http://%s:%s', host, port)
})


// 发送的题目
const questionList = require('./db/questionsdb')

// 返回随机的整数
function randomInt(min, max) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1)) + min
}

// 设置 socket 监听 server
const io = require('socket.io').listen(server)

// 倒计时功能未实现 目前不能重置时间，多次执行会出现多个倒计时
const countdownTime = function(time, s, status) {
	clearInterval(set)
	let t = time
	var set = setInterval(function() {
		// log('status', status, time)
		if (status == true) {
			t--
			s.emit('time', t)
			if (t === 0) {
				clearInterval(set)
			}
		} else if (status == false) {
			log('强行取消', status)
			clearInterval(set)
		}
	}, 1000)
}

// 返回新题目并开启倒计时
let nextQuestion = function(s) {
	s.on('nextQuestion', function(res) {
		// let status = false
		let status = true
		log('前端请求了下一题')
		const index = randomInt(0, 1)
		s.emit('1stQuestion', questionList[index])
		const time = 10
		countdownTime(time, s, status)
	})

}

let groupA = 'groupA'
let groupB = 'groupB'
// 房间列表
// let roomInfo = {
// 	group1: ['小黄', '老王'],
// }
let roomInfo = {
	group1: [
		{
			'小黄': 'xxxxxxxxxx',
		},
		{
			'小红': 'yyyyyyyyyyy'
		}
	]
}
let use
// 自动设置房间号 每组两人
const autoRoom = (user, userId) => {
	let form = {}
	form[user] = userId

	let keys = Object.keys(roomInfo)
	let status = false
	// 循环判断所有房间的人数，如果不满足2人 则添加
	for (let r in roomInfo) {
		let val = roomInfo[r]
		if (val.length < 2) {
			roomInfo[r].push(form)
			status = true
			return r
		}
	}
	// 房间都是满员 || 房间数为空
	if (status == false) {
		let index = 'gourp' + Number(keys.length + 1)
		roomInfo[index] = []
		roomInfo[index].push(form)
		return index

	}
	console.log('roomInfo result', roomInfo)
}
let userList = {}
io.sockets.on('connection', function(socket) {
	socket.on('error', function(msg) {
		console.log('error', msg)
	})
	let userId = socket.id
	let roomId
	// 连接用户后分配房间
	socket.on('init', function(res) {
		// 分配 房间
		let name = res
		// 房间号
		let roomId = autoRoom(res, userId)
		socket.name = res
		userList[name] = userId
		// 向单个用户推送信息，发送题目是按组内成员循环推送
		if(userList[name] != undefined) {
			// 返回房间号
			socketRoom.createRoom(roomId, io, socket)
			io.sockets.connected[userList[name]].emit('room', roomId)
		}

		// nextQuestion(socket)
	})
	socket.on('nextQuestion', function(res) {
		socket.emit('1stQuestion', '新题目请求成功')
	})

	socket.on('joinRoom', function(res) {

	})
	//

	// html 测试
	socket.emit('message', '111111')
	// 进入分组 group1
	// socket.on(groupA, function(data) {
	// 	socket.join(groupA, () => {
	// 		io.to(groupA).emit('groupA', '这里是来自分组1的信息')
	// 	})
	// })
	// socket.on(groupB, function(data) {
	// 	socket.join(groupB)
	// 	io.to(groupB).emit('groupBmsg', '这里是来自分组2的信息')
	// })
	//	class

})



module.exports = {
	io,
}

