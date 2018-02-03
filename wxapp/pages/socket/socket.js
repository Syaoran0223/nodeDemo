// pages/socket/socket.js
const app = getApp()
const { log } = require('../../utils/util')
Page({
	data: {
		time: '',
		questionList: [
			// {
			// 	id: 0,
			// 	title: '3+5+5 = ？',
			// 	options: [
			// 		{
			// 			order: 'A',
			// 			option: '12',
			// 			anwser: false,
			// 		},
			// 		{
			// 			order: 'B',
			// 			option: '15',
			// 			anwser: false,
			// 		},
			// 		{
			// 			order: 'C',
			// 			option: '13',
			// 			anwser: true,
			// 		},
			// 		{
			// 			order: 'D',
			// 			option: '14',
			// 			anwser: false,
			// 		},
			// 	],
			// },
		],
	},

	onLoad: function (options) {
		// 开始进行连接服务器
		const socket = app.globalData.socket
		// this.onSocketEvent()
		this.init()
	},
	// init 
	init() {
		const name = 'feng'
		const that = this
		const socket = app.globalData.socket
		socket.emit('init', name)
		// 保持接收图片
		socket.on('1stQuestion', function (msg) {
			let data = that.data.questionList
			data.push(msg)
			that.setData({ 'questionList': data })
			console.log('收到的到一题', that.data.questionList)
		})
		socket.on('time', (time)=> {
			log('倒计时', time)
			that.setData({'time': time})
		})
	},
	// 发送答案 请求新的题目 在 init 接收
	sendMessage(e) {
		const socket = app.globalData.socket
		socket.emit('nextQuestion', '答案A')
	},
})
