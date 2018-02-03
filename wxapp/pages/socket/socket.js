// pages/socket/socket.js
const app = getApp()
const { log } = require('../../utils/util')
Page({
	data: {
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
		this.onSocketEvent()
	},
	// getQuestion: function(socket, data) {
	// 	socket.emit('question', function(res) {
	// 		log('res', res)
	// 		this.setData('questionList', res)
	// 	})
	// },
	onSocketEvent: function () {
		const socket = app.globalData.socket
		const that = this
		socket.on('login', function (msg) {
			// 用户连接后发送第一题
			let data = that.data.questionList
			data.push(msg)
			that.setData({ 'questionList': data })
			console.log('收到的到一题', that.data.questionList)
		})
		socket.emit('client', '来自前端的消息')

		//
		// socket.on('user left', function(msg) {
		//  wx.showToast({
		//    title: msg.username + ' 离开了房间',
		//    icon: 'loading',
		//    duration: 1000
		//  })
		// })
	},
})
