//index.js
//获取应用实例
const { log, api, ajax } = require('../../utils/config.js')
const app = getApp()


Page({
	data: {
		motto: 'Hello World',
		userInfo: '',
		hasUserInfo: false,
		canIUse: wx.canIUse('button.open-type.getUserInfo')
	},
	onLoad: function () {
		// this.getUserInfo()
		// this.applyBattle()
		this.isLogin()
	},
	// 获取用户信息前置「可不用，待测试」
	getUserInfoBefore: function () {
		if (app.globalData.userInfo) {
			this.setData({
				userInfo: app.globalData.userInfo,
				hasUserInfo: true
			})
		} else if (this.data.canIUse) {
			// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
			// 所以此处加入 callback 以防止这种情况
			app.userInfoReadyCallback = res => {
				this.setData({
					userInfo: res.userInfo,
					hasUserInfo: true
				})
			}
		} else {
			// 在没有 open-type=getUserInfo 版本的兼容处理
			wx.getUserInfo({
				success: res => {
					app.globalData.userInfo = res.userInfo
					this.setData({
						userInfo: res.userInfo,
						hasUserInfo: true
					})
				}
			})
		}
	},
	// 获取用户信息「需要用户授权」   
	getUserInfo: function () {
		this.getUserInfoBefore()
		// let u = wx.getStorageSync('openid')
		// log('index getUserinfo', u)
		// this.setData({ 'openid': u })
	},
	// 点击进入匹配环节
	randomInt(min, max) {
		min = Math.ceil(min)
		max = Math.floor(max)
		return Math.floor(Math.random() * (max - min + 1)) + min
	},
	isLogin() {
		wx.request({
			url: api.loginSatus,
			method:'POST',
			success: function(res) {
				console.log('res')
			}
		})
	},
	applyBattle() {
		let that = this
		let random = this.randomInt(0, 20)
		const socket = app.globalData.socket
		// 发送「准备对战 用户名」给服务器
		let userInfo = wx.getStorageSync('userInfo')
		log('debug userInfo', userInfo.nickName)
		socket.emit('applyBattle', userInfo.nickName)
		socket.on('applyResult', function (res) {
			log('准备完成返回的对手数据', res)
			that.isLogin()
			wx.setStorageSync('equal', res)
			socket.emit('t', function(res) {
				console.log('ebug init es', res)
			})
			// 返回 false 则提示 暂无匹配到对手
			if (res == false) {
				// socket.disconnect();
				wx.showToast({
					title: '匹配失败',
					icon: 'succse',
					duration: 2000
				})
				return 
			} else {
				// 有对手 加入房间 转跳到对战页面
				socket.on('room', function (roomId) {
					wx.setStorageSync('roomId', roomId)
					log('roomId', roomId)
					socket.emit('join', roomId)
					let toRoom = false
					socket.on(roomId, function (res) {
						if(toRoom == false && res) {
							toRoom ==true
							//  确认进入房间后 对战页面
							// wx.navigateTo({
							// 	url: '../socket/socket',
							// })
							wx.redirectTo({
								url: '../socket/socket',
							})
						}
					})
				})
			}
		})
	}
})
