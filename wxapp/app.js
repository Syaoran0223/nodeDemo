//app.js
const { log, api, socketUrl } = require('./utils/config.js')
const io = require('./utils/wxapp-socket-io.js')

// const io = require('./utils/socket-io.js')
App({
	onLaunch:  function () {
		// 展示本地存储能力
		var logs = wx.getStorageSync('logs') || []
		logs.unshift(Date.now())
		wx.setStorageSync('logs', logs)
		// 连接socket
		const socket = io.connect(socketUrl)
		socket.on('applyResult', function (res) {
			log('准备完成返回的对手数据', res)
			// that.isLogin()
			wx.setStorageSync('equal', res)
			// 返回 false 则提示 暂无匹配到对手
			if (res == false) {
				// socket.disconnect();
				// socket.on('disconnect', function () {
				// 	console.log('disconnect client event....');
				// });
				log('debug false')

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
					let toRoom = true
					socket.on(roomId, function (res) {
						log('room返回的数据', res)
						if(toRoom == true) {
							let u = wx.getStorageSync('userInfo')
							log('用户信息', u, u.nickName)
							socket.emit('init', {username:u.nickName,ready:true})
							toRoom = false
							wx.navigateTo({
								url: '../socket/socket',
							})
						}
					})
					let roomQuestion = roomId + 'question'
					let roomQuestionStatus = true
					socket.on(roomQuestion, function(res) {
						log('接收到的题目', res)
						if(roomQuestionStatus == true) {
							wx.setStorageSync('question', res)
							roomQuestionStatus = false
						}
					})
				})
			}
		})
		this.globalData.socket = socket
		// 登录
		wx.login({
			success: codeData => {
				// 发送 res.code 到后台换取 openId, sessionKey, unionId
				let code = {
					code: codeData.code
				}
				wx.getUserInfo({
					success: function (res) {
						var userInfo = res.userInfo
						wx.setStorageSync('userInfo', res.userInfo)
						var nickName = userInfo.nickName
						var avatarUrl = userInfo.avatarUrl
						var gender = userInfo.gender //性别 0：未知、1：男、2：女
						var province = userInfo.province
						var city = userInfo.city
						var country = userInfo.country
					}
				})
				// wx.request({
				// 	url: api.openid,
				// 	data: code,
				// 	method: 'post',
				// 	success: function (openidData) {
				// 		wx.getSetting({
				// 			success: res => {
				// 				log('openidData', openidData)
				// 				wx.setStorageSync('openid', openidData)								
				// 				if (res.authSetting['scope.userInfo']) {
				// 					// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
				// 					log('debug 2')
				// 					wx.getUserInfo({
				// 						success: ress => {
				// 							let that = this
				// 							console.log('ress', ress)
				// 							let userInfo = ress.userInfo
				// 							// 可以将 res 发送给后台解码出 unionId
				// 							// that.globalData.userInfo = ress.userInfo
				// 							wx.setStorageSync('userInfo', userInfo)
				// 							log('debug Storagen', wx.getStorageSync('userInfo'))
				// 							// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
				// 							// 所以此处加入 callback 以防止这种情况
				// 							if (that.userInfoReadyCallback) {
				// 								that.userInfoReadyCallback(ress)
				// 							}
				// 							// 保存openid
				// 							userInfo.openid = openidData.data.openid
				// 							// log('new userInfo', userInfo)
				// 							wx.request({
				// 								url: api.userInfo,
				// 								data: userInfo,
				// 								method: 'post',
				// 								success: (r) => {
				// 									log('发送用户信息', r)
				// 								}
				// 							})
				// 						}
				// 					})
				// 				}
				// 			}
				// 		})

				// 	},
				// 	fail: (res) => {
				// 		console.log('fail', res)
				// 	}
				// })
			}
		})


	},
	globalData: {
		userInfo: null
	}
})
