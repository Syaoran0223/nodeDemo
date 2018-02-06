// 引入模块
const express = require('express')
const nunjucks = require('nunjucks')
const bodyParser = require('body-parser')
const session = require('cookie-session')
const fs = require('fs')
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
// redis 链接错误
redisClient.on('error', function(error) {
	console.log('redisClient', error)
})
// redis 测试
const redisInit = async() => {
	let data = {
			group1: [
				{
					'小黄': 'xxxxxxxxxx',
				},

			]
		}

	await redisClient.set('roomInfo', JSON.stringify(data))
	// await redisClient.get('roomInfo', function(res) {
	// 	log('redis ', res)
	// })

}
redisInit()

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

let userList = {feng1: 'Hjoq3j68I4i7Dq7cAAAA' }
// let roomInfo = {
// 	group1: [
// 		{
// 			'小黄': 'xxxxxxxxxx',
// 		},
//
// 	]
// }
let use
// 自动设置房间号 每组两人
const autoRoom = async(user, userId) => {
	// 判断是否已在房间内 防止刷新
	let users = Object.keys(userList)
	// if ( users.includes(user)) {
	// 	log('已经存在用户列表中')
	// 	return false
	// }
	//
	let form = {}
	form[user] = userId
	// 从 redis 取数据
	let roomInfo = await redisClient.get('roomInfo', function(err, res) {
		if(err) {
			log('err', err)
		} else  {
			log('正式使用 redis', res)
			return res
		}
	})
	log('取出来的 redis')
	let keys = Object.keys(JSON.parse(roomInfo))
	let status = false
	// 循环判断所有房间的人数，如果不满足2人 则添加
	for (let r in roomInfo) {
		let val = roomInfo[r]
		if (val.length < 2) {
			roomInfo[r].push(form)
			status = true
			log('roomInfo', roomInfo)
			return r
		}
	}
	// 房间都是满员 || 房间数为空
	if (status == false) {
		let index = 'gourp' + Number(keys.length + 1)
		roomInfo[index] = []
		roomInfo[index].push(form)
		// 没有对手 返回匹配失败
		log('roomInfo', roomInfo)
		return status

	}
	console.log('roomInfo result', roomInfo)
}
io.sockets.on('connection', function(socket) {

	let userId = socket.id
	let roomId
	let name
	// 连接用户后分配房间
	socket.on('init', function(res) {
		// 分配 房间
		name = res
		// 房间号
		let roomId = autoRoom(res, userId)
		if (roomId == false) {
			// 没有用户处于匹配列表
			log('当前没有正在匹配的用户', roomId)
			// socket.emit('')
			return
		}
		socket.name = res
		userList[name] = userId
		log('userList', userList)
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
	socket.on('disconnect', function(res) {
		// 用户断开连接后从用户列表内删除
		delete userList[name]
		// 删除该用户所在房间 之后再写

		log('delete user', '用户', name, '列表', userList)
	})
})



module.exports = {
	io,
	// roomInfo
}

