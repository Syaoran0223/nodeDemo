// pages/socket/socket.js
const app = getApp()
const _ = require('../../utils/lodash.js')
const { log } = require('../../utils/util')
Page({
	data: {
		time: '',
		selClass:'',
		currentSel: '5',
		selList: {
			"A": 0,
			"B": 1,
			"C": 2,
			"D": 3,
		},
		question: [
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
		roomId: '',
	},

	onLoad: function (options) {
		// 开始进行连接服务器
		const socket = app.globalData.socket
		// this.onSocketEvent()
		this.init()
		// 官方api 测试
		// this.wxSocket()
	},
	// init 
	init() {
		const name = 'feng'
		const that = this
		const socket = app.globalData.socket
		socket.emit('init', {ready: true})
		// 接收房间好
		socket.on('time', (time) => {
			log('倒计时', time)
			that.setData({ 'time': time })
		})
		// socket.disconnect()
		// socket.on('disconnect', function(res) {
		// 	console.log('断开了')
		// })
	},

	// 发送答案 请求新的题目 在 init 接收
	sendMessage(e) {
		let sel = e.target.dataset.sel
		this.data.currentSel = this.data.selList[sel]
		log('currentSel', this.data.currentSel )
		// 选项列表
		let options = this.data.question.options
		// 正确答案
		let anwser = _.find(options, function(o){
			return o.anwser == true
		})
		// 对比答案
		let logic = sel === anwser.order
		if(logic == true) {
			this.data.selClass = 'true'
			log('选择正确', sel, anwser.order)
		} else {
			this.data.selClass = 'false'
			log('选择错误', sel, anwser.order)
		}
		// 选择后发送告诉后端用户选择完成
		const socket = app.globalData.socket
		socket.emit('chooseReady', '答题完成')		
	},
})
