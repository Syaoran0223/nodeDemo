// 引入模块
const express = require('express')
const nunjucks = require('nunjucks')
const bodyParser = require('body-parser')
const session = require('cookie-session')
const fs = require('fs')
const {log} = require('./utils/utils')
const {appId, appSecret, secretKey} = require('./config')
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
		log('status', status)
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

io.on('connection', function(s) {
	log('新用户连接成功',)
	// 返回用户信息 得分
	// 用户连接后发送第一题
	s.on('init', function(res) {
		log('res', res)
		// s.emit('newQuestion', questionList[1])
		nextQuestion(s)
	})
})





