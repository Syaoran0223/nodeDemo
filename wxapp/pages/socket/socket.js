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
		// 接收房间好
		socket.on('room', function(roomId) {
			// 加入房间
			console.log('房间号', roomId)
			socket.emit(roomId)
			socket.on(roomId, function(res) {
				console.log('进入房间后返回的信息', res)
				wx.showToast({
					title: res,
					icon: 'success',
					duration: 2000
				})
			})
		})
		socket.on('1stQuestion', function (msg) {
			let data = that.data.questionList
			data.push(msg)
			that.setData({ 'questionList': data })
			console.log('1stQuestion', that.data.questionList)
		})
		socket.on('time', (time)=> {
			log('倒计时', time)
			that.setData({'time': time})
		})
	},
	//  加入分组1
	joingroupA() {
		const that = this
		const socket = app.globalData.socket
		socket.emit('groupA', '来自客户端的信息，加入groupA')
		socket.on('groupA', (res) => {
			console.log('on gtoupA res', res)
		})
	},
	joingroupB() {
		const that = this
		const socket = app.globalData.socket
		let group = 'groupB'
		socket.emit(group, '来自客户端的信息，加入groupB')
		socket.on('groupBmsg', function (res) {
			console.log('res', res)
		})
	},

	// 发送答案 请求新的题目 在 init 接收
	sendMessage(e) {
		const socket = app.globalData.socket
		socket.emit('nextQuestion', '答案A')
	},
})
