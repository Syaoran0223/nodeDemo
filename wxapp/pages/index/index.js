//index.js
//获取应用实例
const { log, api, ajax } = require('../../utils/config.js')
const app = getApp()

Page({
	data: {
		motto: 'Hello World',
		userInfo: '',
		u:'',
		hasUserInfo: false,
		canIUse: wx.canIUse('button.open-type.getUserInfo')
	},
	onLoad: function () {
		this.getUserInfo()
		this.applyBattle()
	},
	// 获取用户信息前置「可不用，待测试」
	getUserInfoBefore: function() {
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
		// this.getUserInfoBefore()
		let u = wx.getStorageSync('userInfo')
		this.setData({'userInfo': u})
	},
	// 点击进入匹配环节
	applyBattle() {

		const socket = app.globalData.socket
		// 发送「准备对战 用户名」给服务器
		let userName = this.data.userInfo.nickName
		socket.emit('applyBattle', userName)
		socket.on('applyResult', function(res) {
			log('申请结果', res)
		})

	}
})
